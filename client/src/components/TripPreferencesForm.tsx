import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";

const INTEREST_THEMES = [
  { id: "heritage", label: "Cultural Heritage", icon: "🏛️" },
  { id: "adventure", label: "Adventure", icon: "🏔️" },
  { id: "nightlife", label: "Nightlife", icon: "🌃" },
  { id: "food", label: "Local Cuisine", icon: "🍛" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "beaches", label: "Beaches", icon: "🏖️" },
  { id: "spiritual", label: "Spiritual", icon: "🕉️" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
];

interface TripPreferences {
  destination: string;
  budget: number[];
  duration: number[];
  groupSize: number[];
  interests: string[];
  startDate: string;
  endDate: string;
}

interface Props {
  onSubmit: (preferences: TripPreferences) => void;
  isLoading?: boolean;
}

export function TripPreferencesForm({ onSubmit, isLoading = false }: Props) {
  const [preferences, setPreferences] = useState<TripPreferences>({
    destination: "",
    budget: [25000],
    duration: [7],
    groupSize: [2],
    interests: [],
    startDate: "",
    endDate: "",
  });

  const handleInterestToggle = (interestId: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trip preferences submitted:', preferences);
    onSubmit(preferences);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Plan Your Perfect Trip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Where do you want to go?</Label>
            <Input
              id="destination"
              data-testid="input-destination"
              placeholder="e.g., Rajasthan, Kerala, Goa"
              value={preferences.destination}
              onChange={(e) => setPreferences(prev => ({ ...prev, destination: e.target.value }))}
              required
            />
          </div>

          {/* Budget Slider */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget per person: ₹{preferences.budget[0].toLocaleString()}
            </Label>
            <Slider
              value={preferences.budget}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}
              max={100000}
              min={5000}
              step={5000}
              className="w-full"
              data-testid="slider-budget"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹5,000</span>
              <span>₹1,00,000+</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Trip duration: {preferences.duration[0]} days
            </Label>
            <Slider
              value={preferences.duration}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, duration: value }))}
              max={21}
              min={1}
              step={1}
              className="w-full"
              data-testid="slider-duration"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 day</span>
              <span>21+ days</span>
            </div>
          </div>

          {/* Group Size */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group size: {preferences.groupSize[0]} people
            </Label>
            <Slider
              value={preferences.groupSize}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, groupSize: value }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
              data-testid="slider-group-size"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Solo</span>
              <span>10+ people</span>
            </div>
          </div>

          {/* Travel Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                data-testid="input-start-date"
                value={preferences.startDate}
                onChange={(e) => setPreferences(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                data-testid="input-end-date"
                value={preferences.endDate}
                onChange={(e) => setPreferences(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Interest Themes */}
          <div className="space-y-4">
            <Label>What interests you most? (Select multiple)</Label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_THEMES.map((theme) => (
                <Badge
                  key={theme.id}
                  variant={preferences.interests.includes(theme.id) ? "default" : "outline"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleInterestToggle(theme.id)}
                  data-testid={`badge-interest-${theme.id}`}
                >
                  <span className="mr-1">{theme.icon}</span>
                  {theme.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
            data-testid="button-generate-trip"
          >
            {isLoading ? "Creating Your Perfect Trip..." : "Generate My Trip Itinerary"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}