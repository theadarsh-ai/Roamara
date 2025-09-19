import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MapPin, 
  DollarSign, 
  Clock, 
  Smartphone, 
  Shield,
  Zap,
  Users
} from "lucide-react";
import templeImage from "@assets/generated_images/Indian_heritage_temple_cultural_2a730c4f.png";
import streetFoodImage from "@assets/generated_images/Indian_street_food_market_b3ab7d97.png";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Planning",
    description: "Advanced algorithms create personalized itineraries based on your preferences, budget, and travel style.",
    tags: ["Smart", "Personalized"]
  },
  {
    icon: MapPin,
    title: "Local Hidden Gems",
    description: "Discover authentic experiences and lesser-known attractions that most tourists miss.",
    tags: ["Authentic", "Unique"]
  },
  {
    icon: DollarSign,
    title: "Budget Optimization",
    description: "Get maximum value from every rupee with smart budget allocation across accommodation, activities, and meals.",
    tags: ["Cost-Effective", "Smart"]
  },
  {
    icon: Clock,
    title: "Real-Time Adjustments",
    description: "Dynamic itinerary updates based on weather, traffic, and availability for seamless travel.",
    tags: ["Adaptive", "Real-Time"]
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Access your complete itinerary offline, with maps, bookings, and contact details on your phone.",
    tags: ["Offline", "Convenient"]
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "One-click booking with secure payments and instant confirmations for all your travel needs.",
    tags: ["Safe", "Instant"]
  }
];

export function FeatureSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our AI Trip Planner?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of travel planning with intelligent recommendations 
            tailored specifically for your Indian adventure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {feature.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Travel Experiences Showcase */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              Experiences
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Incredible India
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From ancient temples to bustling food markets, experience the rich tapestry of Indian culture
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="overflow-hidden hover-elevate transition-all duration-300">
              <div className="relative h-64">
                <img 
                  src={templeImage} 
                  alt="Ancient Indian temple showcasing rich cultural heritage" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-2">Cultural Heritage</h3>
                  <p className="text-sm text-gray-200">Explore magnificent temples, palaces, and historic monuments</p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden hover-elevate transition-all duration-300">
              <div className="relative h-64">
                <img 
                  src={streetFoodImage} 
                  alt="Vibrant Indian street food market with local delicacies" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-2">Culinary Adventures</h3>
                  <p className="text-sm text-gray-200">Savor authentic flavors and street food delights</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-coral-500/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">Join Thousands of Happy Travelers</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Over 10,000+ personalized trips planned across India with 98% satisfaction rate
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">15min</div>
                  <div className="text-sm text-muted-foreground">Planning Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Destinations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}