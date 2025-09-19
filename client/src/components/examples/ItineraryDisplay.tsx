import { ItineraryDisplay } from '../ItineraryDisplay';

// Mock data for demonstration
const mockItinerary = {
  destination: "Rajasthan",
  duration: "7 Days, 6 Nights",
  totalBudget: 45000,
  days: [
    {
      day: 1,
      date: "March 15, 2024",
      totalCost: 8500,
      activities: [
        {
          id: "1",
          time: "06:00",
          title: "Flight to Jaipur",
          description: "Departure from Delhi, arrival in Jaipur",
          location: "Jaipur Airport",
          cost: 3500,
          type: "transport" as const
        },
        {
          id: "2",
          time: "10:00",
          title: "Check-in at Heritage Hotel",
          description: "Traditional Rajasthani architecture with modern amenities",
          location: "Pink City, Jaipur",
          cost: 4000,
          type: "accommodation" as const
        },
        {
          id: "3",
          time: "14:00",
          title: "Hawa Mahal Visit",
          description: "Explore the iconic Palace of Winds with photo opportunities",
          location: "Hawa Mahal Rd, Badi Choupad",
          cost: 500,
          type: "activity" as const
        },
        {
          id: "4",
          time: "18:00",
          title: "Traditional Rajasthani Dinner",
          description: "Authentic dal baati churma with folk dance performance",
          location: "Chokhi Dhani Village Resort",
          cost: 500,
          type: "meal" as const
        }
      ]
    },
    {
      day: 2,
      date: "March 16, 2024", 
      totalCost: 6500,
      activities: [
        {
          id: "5",
          time: "08:00",
          title: "Amber Fort Exploration",
          description: "Majestic fort with elephant ride and mirror palace",
          location: "Devisinghpura, Amer",
          cost: 1000,
          type: "activity" as const
        },
        {
          id: "6",
          time: "13:00",
          title: "Local Cuisine Lunch",
          description: "Street food tour in the old city markets",
          location: "Johari Bazaar",
          cost: 300,
          type: "meal" as const
        },
        {
          id: "7",
          time: "15:00",
          title: "City Palace Tour",
          description: "Royal residence with museum and courtyards",
          location: "Tulsi Marg, Gangori Bazaar",
          cost: 700,
          type: "activity" as const
        },
        {
          id: "8",
          time: "20:00",
          title: "Hotel Stay",
          description: "Second night at heritage hotel",
          location: "Pink City, Jaipur",
          cost: 4000,
          type: "accommodation" as const
        },
        {
          id: "9",
          time: "21:00",
          title: "Rooftop Dining",
          description: "Dinner with city skyline views",
          location: "Hotel Rooftop Restaurant",
          cost: 500,
          type: "meal" as const
        }
      ]
    }
  ],
  summary: {
    accommodation: 24000,
    transport: 8500,
    activities: 9000,
    meals: 3500
  }
};

export default function ItineraryDisplayExample() {
  const handleBook = () => {
    console.log('Booking trip...');
  };

  const handleDownload = () => {
    console.log('Downloading PDF...');
  };

  return <ItineraryDisplay 
    itinerary={mockItinerary} 
    onBook={handleBook}
    onDownload={handleDownload}
  />;
}