// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  trips;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.trips = /* @__PURE__ */ new Map();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Trip management methods
  async createTrip(insertTrip) {
    const id = randomUUID();
    const trip = {
      id,
      destination: insertTrip.destination,
      budget: insertTrip.budget,
      duration: insertTrip.duration,
      groupSize: insertTrip.groupSize,
      interests: insertTrip.interests,
      startDate: insertTrip.startDate,
      endDate: insertTrip.endDate,
      generatedItinerary: insertTrip.generatedItinerary,
      isBooked: insertTrip.isBooked ?? 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.trips.set(id, trip);
    return trip;
  }
  async getTrip(id) {
    return this.trips.get(id);
  }
  async updateTripItinerary(id, itinerary) {
    const trip = this.trips.get(id);
    if (!trip) return void 0;
    const updatedTrip = {
      ...trip,
      generatedItinerary: itinerary
    };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }
  async markTripAsBooked(id) {
    const trip = this.trips.get(id);
    if (!trip) return void 0;
    const updatedTrip = {
      ...trip,
      isBooked: 1
    };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }
  async getAllTrips() {
    return Array.from(this.trips.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
};
var storage = new MemStorage();

// server/services/itinerary-ai.ts
import { GoogleGenAI } from "@google/genai";
import { randomUUID as randomUUID2 } from "crypto";
var apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is not set");
}
var ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
async function generateItinerary(preferences) {
  if (!ai) {
    throw new Error("AI service unavailable - GEMINI_API_KEY not configured");
  }
  try {
    const systemPrompt = `You are an expert travel planner specializing in Indian destinations. 
    Create detailed, realistic itineraries based on user preferences.
    
    IMPORTANT RULES:
    - All costs must be in INR (Indian Rupees)
    - Stay within the specified budget
    - Include realistic travel times and costs for India
    - Consider local customs, weather, and practical logistics
    - Suggest authentic local experiences based on selected interests
    - Include a mix of popular attractions and hidden gems
    - Account for travel time between locations
    - Provide specific location names and addresses where possible
    
    Response format must be valid JSON matching this structure:
    {
      "destination": "string",
      "totalBudget": number,
      "days": [
        {
          "day": number,
          "date": "YYYY-MM-DD",
          "activities": [
            {
              "time": "HH:MM",
              "title": "Activity Name",
              "description": "Detailed description",
              "location": "Specific location/address",
              "cost": number,
              "type": "accommodation|transport|activity|meal"
            }
          ]
        }
      ]
    }`;
    const userPrompt = `Create a ${preferences.duration}-day itinerary for ${preferences.destination} with these preferences:
    
    Budget: \u20B9${preferences.budget} per person
    Group Size: ${preferences.groupSize} people
    Travel Dates: ${preferences.startDate} to ${preferences.endDate}
    Interests: ${preferences.interests.join(", ")}
    
    Please create a balanced itinerary that:
    - Maximizes value within the budget
    - Incorporates the specified interests
    - Includes appropriate accommodation, transport, meals, and activities
    - Considers the group size for cost calculations
    - Provides authentic Indian travel experiences
    - Includes specific timings and realistic costs`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            destination: { type: "string" },
            totalBudget: { type: "number" },
            days: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  date: { type: "string" },
                  activities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        time: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        location: { type: "string" },
                        cost: { type: "number" },
                        type: { type: "string", enum: ["accommodation", "transport", "activity", "meal"] }
                      },
                      required: ["time", "title", "description", "location", "cost", "type"]
                    }
                  }
                },
                required: ["day", "date", "activities"]
              }
            }
          },
          required: ["destination", "totalBudget", "days"]
        }
      },
      contents: userPrompt
    });
    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }
    console.log(`Gemini AI Response: ${rawJson.substring(0, 500)}...`);
    const aiResponse = JSON.parse(rawJson);
    if (!aiResponse.destination || !aiResponse.days || !Array.isArray(aiResponse.days)) {
      throw new Error("Invalid AI response structure");
    }
    const transformedDays = aiResponse.days.map((day) => {
      const activities = day.activities.map((activity) => ({
        id: randomUUID2(),
        time: activity.time,
        title: activity.title,
        description: activity.description,
        location: activity.location,
        cost: activity.cost,
        type: activity.type
      }));
      const totalCost = activities.reduce((sum, activity) => sum + activity.cost, 0);
      return {
        day: day.day,
        date: day.date,
        activities,
        totalCost
      };
    });
    const summary = transformedDays.reduce(
      (acc, day) => {
        day.activities.forEach((activity) => {
          switch (activity.type) {
            case "accommodation":
              acc.accommodation += activity.cost;
              break;
            case "transport":
              acc.transport += activity.cost;
              break;
            case "activity":
              acc.activities += activity.cost;
              break;
            case "meal":
              acc.meals += activity.cost;
              break;
          }
        });
        return acc;
      },
      { accommodation: 0, transport: 0, activities: 0, meals: 0 }
    );
    const totalBudget = Object.values(summary).reduce((sum, cost) => sum + cost, 0);
    const itinerary = {
      destination: aiResponse.destination,
      duration: `${preferences.duration} Days, ${preferences.duration - 1} Nights`,
      totalBudget,
      days: transformedDays,
      summary
    };
    return itinerary;
  } catch (error) {
    console.error("Error generating itinerary with AI:", error);
    throw new Error(`AI itinerary generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function isAIAvailable() {
  return ai !== null && !!process.env.GEMINI_API_KEY;
}

// server/routes.ts
import { z } from "zod";
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil"
});
var tripPreferencesSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  budget: z.number().min(1e3, "Budget must be at least \u20B91000"),
  duration: z.number().min(1).max(30, "Duration must be between 1-30 days"),
  groupSize: z.number().min(1).max(20, "Group size must be between 1-20 people"),
  interests: z.array(z.string()).min(1, "At least one interest must be selected"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required")
});
async function registerRoutes(app2) {
  app2.get("/api/health/ai", (req, res) => {
    const available = isAIAvailable();
    res.json({
      available,
      service: "Gemini AI",
      status: available ? "operational" : "unavailable",
      message: available ? "AI service is ready" : "GEMINI_API_KEY not configured"
    });
  });
  app2.post("/api/trips/generate", async (req, res) => {
    if (!isAIAvailable()) {
      return res.status(503).json({
        error: "AI service unavailable",
        message: "The AI service is currently not available. Please try again later."
      });
    }
    try {
      console.log("Generating itinerary request:", req.body);
      const validationResult = tripPreferencesSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid trip preferences",
          details: validationResult.error.errors
        });
      }
      const preferences = validationResult.data;
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
      const itinerary = await generateItinerary(preferences);
      console.log("Generated itinerary for:", preferences.destination);
      const updatedTrip = await storage.updateTripItinerary(trip.id, itinerary);
      res.json({
        tripId: trip.id,
        itinerary
      });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      if (error instanceof Error && error.message.includes("AI service unavailable")) {
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
  app2.get("/api/trips/:id", async (req, res) => {
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
  app2.post("/api/trips/:id/book", async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentInfo } = req.body;
      console.log("Booking trip:", id, "with payment info:", paymentInfo?.cardNumber ? "[CARD PROVIDED]" : "[NO CARD]");
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
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
  app2.get("/api/trips", async (req, res) => {
    try {
      const trips = await storage.getAllTrips();
      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });
  app2.post("/api/payments/create-intent", async (req, res) => {
    try {
      const { amount, currency, tripId, customerInfo } = req.body;
      if (!amount || amount < 50) {
        return res.status(400).json({
          error: "Invalid amount",
          message: "Amount must be at least \u20B90.50"
        });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        // Amount in paisa
        currency: currency || "inr",
        metadata: {
          tripId: tripId || "",
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerEmail: customerInfo.email
        }
      });
      res.json({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        error: "Payment setup failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/payments/confirm", async (req, res) => {
    try {
      const { payment_intent_id, tripId } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          error: "Payment not completed",
          message: "Payment has not been successfully processed"
        });
      }
      if (tripId) {
        await storage.markTripAsBooked(tripId);
        console.log(`Trip ${tripId} successfully booked with payment ${payment_intent_id}`);
      }
      res.json({
        success: true,
        payment_status: paymentIntent.status,
        amount_received: paymentIntent.amount_received
      });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({
        error: "Payment confirmation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
