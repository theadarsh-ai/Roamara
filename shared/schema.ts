import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Trip preferences and generated itineraries
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destination: text("destination").notNull(),
  budget: integer("budget").notNull(),
  duration: integer("duration").notNull(),
  groupSize: integer("group_size").notNull(),
  interests: jsonb("interests").notNull().$type<string[]>(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  generatedItinerary: jsonb("generated_itinerary"),
  isBooked: integer("is_booked").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;

// Trip-related types
export interface TripPreferences {
  destination: string;
  budget: number;
  duration: number;
  groupSize: number;
  interests: string[];
  startDate: string;
  endDate: string;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  cost: number;
  type: 'accommodation' | 'transport' | 'activity' | 'meal';
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  totalCost: number;
}

export interface GeneratedItinerary {
  destination: string;
  duration: string;
  totalBudget: number;
  days: DayPlan[];
  summary: {
    accommodation: number;
    transport: number;
    activities: number;
    meals: number;
  };
}
