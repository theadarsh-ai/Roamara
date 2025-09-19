import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { TripPreferencesForm } from "@/components/TripPreferencesForm";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { BookingModal } from "@/components/BookingModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock itinerary data for demonstration //todo: remove mock functionality
const mockItinerary = {
  destination: "Rajasthan Cultural Journey",
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
          description: "Departure from Delhi, arrival in Jaipur with airport transfers included",
          location: "Jaipur Airport",
          cost: 3500,
          type: "transport" as const
        },
        {
          id: "2",
          time: "10:00",
          title: "Check-in at Heritage Hotel",
          description: "Traditional Rajasthani architecture with modern amenities and welcome drinks",
          location: "Pink City, Jaipur",
          cost: 4000,
          type: "accommodation" as const
        },
        {
          id: "3",
          time: "14:00",
          title: "Hawa Mahal & City Palace",
          description: "Explore the iconic Palace of Winds and royal residence with guided tour",
          location: "Hawa Mahal Rd, Pink City",
          cost: 700,
          type: "activity" as const
        },
        {
          id: "4",
          time: "19:00",
          title: "Rajasthani Cultural Dinner",
          description: "Authentic dal baati churma with live folk dance performance",
          location: "Chokhi Dhani Village Resort",
          cost: 300,
          type: "meal" as const
        }
      ]
    },
    {
      day: 2,
      date: "March 16, 2024", 
      totalCost: 7200,
      activities: [
        {
          id: "5",
          time: "08:00",
          title: "Amber Fort Adventure",
          description: "Majestic fort exploration with elephant ride and mirror palace visit",
          location: "Devisinghpura, Amer",
          cost: 1200,
          type: "activity" as const
        },
        {
          id: "6",
          time: "13:00",
          title: "Local Street Food Tour",
          description: "Guided food walk through traditional markets and local eateries",
          location: "Johari Bazaar, Old City",
          cost: 400,
          type: "meal" as const
        },
        {
          id: "7",
          time: "15:30",
          title: "Jantar Mantar Observatory",
          description: "UNESCO World Heritage astronomical instruments and science history",
          location: "Gangori Bazaar, J.D.A. Market",
          cost: 600,
          type: "activity" as const
        },
        {
          id: "8",
          time: "20:00",
          title: "Heritage Hotel Stay",
          description: "Second night with rooftop dining overlooking the Pink City",
          location: "Pink City, Jaipur",
          cost: 4500,
          type: "accommodation" as const
        },
        {
          id: "9",
          time: "21:00",
          title: "Sunset Rooftop Dinner",
          description: "Multi-cuisine dining with panoramic city views and live music",
          location: "Hotel Rooftop Restaurant",
          cost: 500,
          type: "meal" as const
        }
      ]
    },
    {
      day: 3,
      date: "March 17, 2024",
      totalCost: 9500,
      activities: [
        {
          id: "10",
          time: "07:00",
          title: "Travel to Udaipur",
          description: "Scenic drive through Aravalli hills with lunch stop at local dhaba",
          location: "Jaipur to Udaipur",
          cost: 2500,
          type: "transport" as const
        },
        {
          id: "11",
          time: "14:00",
          title: "Lake Palace & City Palace",
          description: "Boat ride to the famous Lake Palace and exploring the royal complex",
          location: "Lake Pichola, Udaipur",
          cost: 1000,
          type: "activity" as const
        },
        {
          id: "12",
          time: "17:00",
          title: "Lakeside Hotel Check-in",
          description: "Luxury accommodation with lake views and traditional Rajasthani decor",
          location: "Lake Pichola, Udaipur",
          cost: 5500,
          type: "accommodation" as const
        },
        {
          id: "13",
          time: "20:00",
          title: "Lakeside Candlelight Dinner",
          description: "Romantic dining experience with lake views and traditional music",
          location: "Hotel Lakeside Restaurant",
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

type Step = 'hero' | 'form' | 'loading' | 'itinerary';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleGetStarted = () => {
    console.log('Get started clicked - moving to form');
    setCurrentStep('form');
  };

  const handleFormSubmit = async (preferences: any) => {
    console.log('Form submitted with preferences:', preferences);
    setIsGenerating(true);
    setCurrentStep('loading');
    
    // Simulate AI generation process //todo: remove mock functionality
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep('itinerary');
    }, 3000);
  };

  const handleBackToForm = () => {
    console.log('Back to form clicked');
    setCurrentStep('form');
  };

  const handleBackToHero = () => {
    console.log('Back to hero clicked');
    setCurrentStep('hero');
  };

  const handleBookTrip = () => {
    console.log('Book trip clicked');
    setIsBookingOpen(true);
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF clicked');
    // In a real implementation, this would generate and download a PDF
    alert('PDF download feature would be implemented here');
  };

  const handleConfirmBooking = (paymentInfo: any) => {
    console.log('Booking confirmed:', paymentInfo);
    setIsBooking(true);
    
    // Simulate payment processing //todo: remove mock functionality
    setTimeout(() => {
      setIsBooking(false);
      setIsBookingOpen(false);
    }, 2000);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'hero':
        return (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <FeatureSection />
          </>
        );

      case 'form':
        return (
          <div className="min-h-screen bg-background py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-8">
                <Button 
                  variant="outline" 
                  onClick={handleBackToHero}
                  className="mb-4"
                  data-testid="button-back-hero"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <h1 className="text-3xl font-bold text-center mb-2">
                  Tell Us About Your Dream Trip
                </h1>
                <p className="text-muted-foreground text-center max-w-2xl mx-auto">
                  Share your preferences and let our AI create the perfect itinerary for you
                </p>
              </div>
              
              <TripPreferencesForm 
                onSubmit={handleFormSubmit}
                isLoading={isGenerating}
              />
            </div>
          </div>
        );

      case 'loading':
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <LoadingSpinner 
              message="Our AI is crafting your perfect itinerary... This may take a moment"
              size="lg"
            />
          </div>
        );

      case 'itinerary':
        return (
          <div className="min-h-screen bg-background py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleBackToForm}
                  className="mb-4"
                  data-testid="button-back-form"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Modify Preferences
                </Button>
                <h1 className="text-3xl font-bold mb-2">
                  Your Personalized Itinerary
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  AI-generated based on your preferences with real-time optimization
                </p>
              </div>
              
              <ItineraryDisplay
                itinerary={mockItinerary}
                onBook={handleBookTrip}
                onDownload={handleDownloadPDF}
                isBooking={isBooking}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-xl">Trip Planner</span>
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Booking Modal */}
      <BookingModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingDetails={{
          destination: mockItinerary.destination,
          duration: mockItinerary.duration,
          totalAmount: mockItinerary.totalBudget,
          breakdown: mockItinerary.summary
        }}
        onConfirmBooking={handleConfirmBooking}
        isProcessing={isBooking}
      />
    </div>
  );
}