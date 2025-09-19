import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateItinerary, isAIAvailable } from "./services/itinerary-ai";
import { insertTripSchema, type TripPreferences } from "@shared/schema";
import { z } from "zod";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

// Validation schemas
const tripPreferencesSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  budget: z.number().min(1000, "Budget must be at least ₹1000"),
  duration: z.number().min(1).max(30, "Duration must be between 1-30 days"),
  groupSize: z.number().min(1).max(20, "Group size must be between 1-20 people"),
  interests: z.array(z.string()).min(1, "At least one interest must be selected"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check for AI service
  app.get("/api/health/ai", (req, res) => {
    const available = isAIAvailable();
    res.json({
      available,
      service: "Gemini AI",
      status: available ? "operational" : "unavailable",
      message: available ? "AI service is ready" : "GEMINI_API_KEY not configured"
    });
  });

  // Generate AI-powered itinerary
  app.post("/api/trips/generate", async (req, res) => {
    // Check AI availability first
    if (!isAIAvailable()) {
      return res.status(503).json({
        error: "AI service unavailable",
        message: "The AI service is currently not available. Please try again later."
      });
    }
    try {
      console.log("Generating itinerary request:", req.body);
      
      // Validate request body
      const validationResult = tripPreferencesSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid trip preferences",
          details: validationResult.error.errors
        });
      }

      const preferences: TripPreferences = validationResult.data;
      
      // Create trip record
      const tripData = {
        destination: preferences.destination,
        budget: preferences.budget,
        duration: preferences.duration,
        groupSize: preferences.groupSize,
        interests: preferences.interests,
        startDate: preferences.startDate,
        endDate: preferences.endDate,
        generatedItinerary: null,
        isBooked: 0
      };
      
      const trip = await storage.createTrip(tripData);
      console.log("Created trip record:", trip.id);
      
      // Generate itinerary using AI
      const itinerary = await generateItinerary(preferences);
      console.log("Generated itinerary for:", preferences.destination);
      
      // Update trip with generated itinerary
      const updatedTrip = await storage.updateTripItinerary(trip.id, itinerary);
      
      res.json({
        tripId: trip.id,
        itinerary
      });
      
    } catch (error) {
      console.error("Error generating itinerary:", error);
      
      // If AI generation fails, return proper error
      if (error instanceof Error && error.message.includes('AI service unavailable')) {
        res.status(503).json({
          error: "AI service unavailable",
          message: "The AI service is currently not available. Please try again later."
        });
      } else {
        res.status(500).json({
          error: "Failed to generate itinerary",
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  // Get trip by ID
  app.get("/api/trips/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const trip = await storage.getTrip(id);
      
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      
      res.json(trip);
    } catch (error) {
      console.error("Error fetching trip:", error);
      res.status(500).json({ error: "Failed to fetch trip" });
    }
  });

  // Book a trip (mark as booked)
  app.post("/api/trips/:id/book", async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentInfo } = req.body;
      
      console.log("Booking trip:", id, "with payment info:", paymentInfo?.cardNumber ? "[CARD PROVIDED]" : "[NO CARD]");
      
      // In a real implementation, this would process payment with Stripe
      // For now, we'll simulate successful payment processing
      
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      
      // Mark trip as booked
      const bookedTrip = await storage.markTripAsBooked(id);
      
      res.json({
        success: true,
        bookingId: `TRP${Date.now()}`,
        trip: bookedTrip
      });
      
    } catch (error) {
      console.error("Error booking trip:", error);
      res.status(500).json({ error: "Failed to book trip" });
    }
  });

  // Get all trips (for admin/debugging)
  app.get("/api/trips", async (req, res) => {
    try {
      const trips = await storage.getAllTrips();
      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  // Create Stripe payment intent
  app.post("/api/payments/create-intent", async (req, res) => {
    try {
      const { amount, currency, tripId, customerInfo } = req.body;
      
      // Validate amount (minimum 50 paisa for Stripe in INR)
      if (!amount || amount < 50) {
        return res.status(400).json({
          error: "Invalid amount",
          message: "Amount must be at least ₹0.50"
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in paisa
        currency: currency || 'inr',
        metadata: {
          tripId: tripId || '',
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerEmail: customerInfo.email,
        },
      });

      res.json({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        error: "Payment setup failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Handle successful payment completion
  app.post("/api/payments/confirm", async (req, res) => {
    try {
      const { payment_intent_id, tripId } = req.body;
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          error: "Payment not completed",
          message: "Payment has not been successfully processed"
        });
      }

      // Update trip booking status if tripId is provided
      if (tripId) {
        await storage.markTripAsBooked(tripId);
        console.log(`Trip ${tripId} successfully booked with payment ${payment_intent_id}`);
      }

      res.json({
        success: true,
        payment_status: paymentIntent.status,
        amount_received: paymentIntent.amount_received,
      });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({
        error: "Payment confirmation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
