import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  Plane,
  Car,
  Camera,
  Utensils,
  Bed,
  Download,
  CreditCard
} from "lucide-react";

interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  cost: number;
  type: 'accommodation' | 'transport' | 'activity' | 'meal';
}

interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  totalCost: number;
}

interface Itinerary {
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

interface Props {
  itinerary: Itinerary;
  onBook: () => void;
  onDownload: () => void;
  isBooking?: boolean;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'accommodation': return <Bed className="h-4 w-4" />;
    case 'transport': return <Car className="h-4 w-4" />;
    case 'activity': return <Camera className="h-4 w-4" />;
    case 'meal': return <Utensils className="h-4 w-4" />;
    default: return <MapPin className="h-4 w-4" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'accommodation': return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'transport': return 'bg-green-50 border-green-200 text-green-800';
    case 'activity': return 'bg-purple-50 border-purple-200 text-purple-800';
    case 'meal': return 'bg-orange-50 border-orange-200 text-orange-800';
    default: return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export function ItineraryDisplay({ itinerary, onBook, onDownload, isBooking = false }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {itinerary.destination} Itinerary
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {itinerary.duration} • Generated with AI
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onDownload}
                data-testid="button-download-itinerary"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                onClick={onBook}
                disabled={isBooking}
                data-testid="button-book-trip"
                className="bg-coral-500 hover:bg-coral-600 text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isBooking ? "Processing..." : "Book This Trip"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₹{itinerary.totalBudget.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{itinerary.summary.accommodation.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Accommodation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{itinerary.summary.transport.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Transport</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{itinerary.summary.activities.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        {itinerary.days.map((day) => (
          <Card key={day.day}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Day {day.day} - {day.date}
                </div>
                <Badge variant="outline">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ₹{day.totalCost.toLocaleString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {day.activities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex gap-4 p-4 rounded-lg bg-muted/20 hover-elevate">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{activity.time}</span>
                            </div>
                            <h4 className="font-semibold text-foreground mb-1">
                              {activity.title}
                            </h4>
                            <p className="text-muted-foreground text-sm mb-2">
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {activity.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              ₹{activity.cost.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {activity.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < day.activities.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}