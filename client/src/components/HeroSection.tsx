import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/India_travel_destinations_hero_f903321f.png";

interface Props {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: Props) {
  return (
    <div 
      className="relative h-[600px] flex items-center justify-center text-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`
      }}
    >
      <div className="max-w-4xl mx-auto px-4 text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-6">
          <Sparkles className="h-4 w-4" />
          Powered by Roamara
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Your Perfect Indian Adventure
          <br />
          <span className="text-coral-500">Starts Here</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">
          Get personalized trip itineraries tailored to your budget, interests, and dreams. 
          From cultural heritage to adventure – we've got you covered.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 text-lg"
            data-testid="button-get-started"
          >
            Plan My Trip
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            data-testid="button-learn-more"
          >
            How It Works
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-sm text-gray-300">Happy Travelers</div>
          </div>
          <div>
            <div className="text-3xl font-bold">500+</div>
            <div className="text-sm text-gray-300">Destinations</div>
          </div>
          <div>
            <div className="text-3xl font-bold">98%</div>
            <div className="text-sm text-gray-300">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}