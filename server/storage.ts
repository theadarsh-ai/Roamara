import { type User, type InsertUser, type Trip, type InsertTrip, type GeneratedItinerary } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trip management
  createTrip(trip: InsertTrip): Promise<Trip>;
  getTrip(id: string): Promise<Trip | undefined>;
  updateTripItinerary(id: string, itinerary: GeneratedItinerary): Promise<Trip | undefined>;
  markTripAsBooked(id: string): Promise<Trip | undefined>;
  getAllTrips(): Promise<Trip[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private trips: Map<string, Trip>;

  constructor() {
    this.users = new Map();
    this.trips = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Trip management methods
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = randomUUID();
    const trip: Trip = {
      id,
      destination: insertTrip.destination,
      budget: insertTrip.budget,
      duration: insertTrip.duration,
      groupSize: insertTrip.groupSize,
      interests: insertTrip.interests as string[],
      startDate: insertTrip.startDate,
      endDate: insertTrip.endDate,
      generatedItinerary: insertTrip.generatedItinerary,
      isBooked: insertTrip.isBooked ?? 0,
      createdAt: new Date(),
    };
    this.trips.set(id, trip);
    return trip;
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async updateTripItinerary(id: string, itinerary: GeneratedItinerary): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip = {
      ...trip,
      generatedItinerary: itinerary
    };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  async markTripAsBooked(id: string): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip = {
      ...trip,
      isBooked: 1
    };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  async getAllTrips(): Promise<Trip[]> {
    return Array.from(this.trips.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
}

export const storage = new MemStorage();
