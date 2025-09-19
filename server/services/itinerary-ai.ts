import { GoogleGenAI } from "@google/genai";
import type { TripPreferences, GeneratedItinerary, Activity, DayPlan } from "@shared/schema";
import { randomUUID } from "crypto";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is not set");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface AIItineraryResponse {
  destination: string;
  totalBudget: number;
  days: {
    day: number;
    date: string;
    activities: {
      time: string;
      title: string;
      description: string;
      location: string;
      cost: number;
      type: 'accommodation' | 'transport' | 'activity' | 'meal';
    }[];
  }[];
}

export async function generateItinerary(preferences: TripPreferences): Promise<GeneratedItinerary> {
  // Check if AI is available
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
    
    Budget: ₹${preferences.budget} per person
    Group Size: ${preferences.groupSize} people
    Travel Dates: ${preferences.startDate} to ${preferences.endDate}
    Interests: ${preferences.interests.join(', ')}
    
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
      contents: userPrompt,
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    console.log(`Gemini AI Response: ${rawJson.substring(0, 500)}...`);

    const aiResponse: AIItineraryResponse = JSON.parse(rawJson);
    
    // Validate AI response structure
    if (!aiResponse.destination || !aiResponse.days || !Array.isArray(aiResponse.days)) {
      throw new Error("Invalid AI response structure");
    }
    
    // Transform AI response to our internal format
    const transformedDays: DayPlan[] = aiResponse.days.map(day => {
      const activities: Activity[] = day.activities.map(activity => ({
        id: randomUUID(),
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

    // Calculate summary costs
    const summary = transformedDays.reduce(
      (acc, day) => {
        day.activities.forEach(activity => {
          switch (activity.type) {
            case 'accommodation':
              acc.accommodation += activity.cost;
              break;
            case 'transport':
              acc.transport += activity.cost;
              break;
            case 'activity':
              acc.activities += activity.cost;
              break;
            case 'meal':
              acc.meals += activity.cost;
              break;
          }
        });
        return acc;
      },
      { accommodation: 0, transport: 0, activities: 0, meals: 0 }
    );

    const totalBudget = Object.values(summary).reduce((sum, cost) => sum + cost, 0);

    const itinerary: GeneratedItinerary = {
      destination: aiResponse.destination,
      duration: `${preferences.duration} Days, ${preferences.duration - 1} Nights`,
      totalBudget,
      days: transformedDays,
      summary
    };

    return itinerary;

  } catch (error) {
    console.error('Error generating itinerary with AI:', error);
    throw new Error(`AI itinerary generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Health check function
export function isAIAvailable(): boolean {
  return ai !== null && !!process.env.GEMINI_API_KEY;
}