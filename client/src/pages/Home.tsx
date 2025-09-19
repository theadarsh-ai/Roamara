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
import type { GeneratedItinerary } from "@shared/schema";


type Step = 'hero' | 'form' | 'loading' | 'itinerary';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);

  const handleGetStarted = () => {
    console.log('Get started clicked - moving to form');
    setCurrentStep('form');
  };

  const handleFormSubmit = async (preferences: any) => {
    console.log('Form submitted with preferences:', preferences);
    setIsGenerating(true);
    setCurrentStep('loading');
    
    try {
      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: preferences.destination,
          budget: preferences.budget[0],
          duration: preferences.duration[0],
          groupSize: preferences.groupSize[0],
          interests: preferences.interests,
          startDate: preferences.startDate,
          endDate: preferences.endDate
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Generated itinerary:', data);
      
      setCurrentTripId(data.tripId);
      setGeneratedItinerary(data.itinerary);
      setCurrentStep('itinerary');
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Show error to user
      alert('Failed to generate itinerary. Please try again.');
      setCurrentStep('form');
    } finally {
      setIsGenerating(false);
    }
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

  const handleConfirmBooking = async (paymentInfo: any) => {
    console.log('Booking confirmed:', paymentInfo);
    setIsBooking(true);
    
    try {
      if (!currentTripId) {
        throw new Error('No trip selected for booking');
      }
      
      const response = await fetch(`/api/trips/${currentTripId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentInfo })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Booking successful:', data);
      
      // The BookingModal will handle the success state
      setTimeout(() => {
        setIsBooking(false);
        // Don't close modal immediately - let user see confirmation
      }, 2000);
      
    } catch (error) {
      console.error('Error booking trip:', error);
      setIsBooking(false);
      alert('Failed to book trip. Please try again.');
    }
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
              
              {generatedItinerary && (
                <ItineraryDisplay
                  itinerary={generatedItinerary}
                  onBook={handleBookTrip}
                  onDownload={handleDownloadPDF}
                  isBooking={isBooking}
                />
              )}
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
      {generatedItinerary && (
        <BookingModal
          open={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          bookingDetails={{
            destination: generatedItinerary.destination,
            duration: generatedItinerary.duration,
            totalAmount: generatedItinerary.totalBudget,
            breakdown: generatedItinerary.summary
          }}
          onConfirmBooking={handleConfirmBooking}
          isProcessing={isBooking}
          tripId={currentTripId || undefined}
        />
      )}
    </div>
  );
}