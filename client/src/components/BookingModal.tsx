import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface BookingDetails {
  destination: string;
  duration: string;
  totalAmount: number;
  breakdown: {
    accommodation: number;
    transport: number;
    activities: number;
    meals: number;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails;
  onConfirmBooking: (paymentInfo: any) => void;
  isProcessing?: boolean;
  tripId?: string;
}

function BookingForm({ 
  bookingDetails, 
  onConfirmBooking, 
  isProcessing = false,
  tripId,
  onClose
}: Omit<Props, 'open'>) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinueToPayment = () => {
    console.log('Proceeding to payment with details:', formData);
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Payment system not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({
        title: "Payment Error",
        description: "Card information is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(bookingDetails.totalAmount * 100), // Convert to paisa
          currency: 'inr',
          tripId,
          customerInfo: formData,
        }),
      });

      const { client_secret } = await response.json();

      // Confirm payment
      const { error } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
            },
          },
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Payment could not be processed.",
          variant: "destructive",
        });
      } else {
        onConfirmBooking({ ...formData, paymentConfirmed: true });
        setStep('confirmation');
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed!",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              data-testid="input-first-name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              data-testid="input-last-name"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              data-testid="input-email"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              data-testid="input-phone"
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              data-testid="input-address"
              required
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={handleContinueToPayment}
        className="w-full"
        data-testid="button-continue-payment"
      >
        Continue to Payment
      </Button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <div className="space-y-4">
          <div>
            <Label>Card Information</Label>
            <div className="border rounded-md p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setStep('details')}
          className="flex-1"
          data-testid="button-back-details"
        >
          Back
        </Button>
        <Button 
          onClick={handleConfirmPayment}
          disabled={isProcessing || !stripe}
          className="flex-1"
          data-testid="button-confirm-payment"
        >
          {isProcessing ? "Processing..." : `Pay ₹${bookingDetails.totalAmount.toLocaleString()}`}
        </Button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
        <p className="text-muted-foreground">
          Your trip to {bookingDetails.destination} has been successfully booked. 
          You'll receive a confirmation email shortly.
        </p>
      </div>
      <Badge variant="outline" className="mx-auto">
        Booking ID: #TRP{Math.random().toString(36).substr(2, 9).toUpperCase()}
      </Badge>
      <Button onClick={onClose} className="w-full" data-testid="button-close-confirmation">
        Close
      </Button>
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Trip Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trip Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{bookingDetails.destination}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {bookingDetails.duration}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Accommodation</span>
              <span>₹{bookingDetails.breakdown.accommodation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transport</span>
              <span>₹{bookingDetails.breakdown.transport.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Activities</span>
              <span>₹{bookingDetails.breakdown.activities.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Meals</span>
              <span>₹{bookingDetails.breakdown.meals.toLocaleString()}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{bookingDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Free Cancellation</p>
                <p>Cancel up to 24 hours before your trip starts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <div>
        {step === 'details' && renderDetailsStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'confirmation' && renderConfirmationStep()}
      </div>
    </div>
  );
}

export function BookingModal({ 
  open, 
  onClose, 
  bookingDetails, 
  onConfirmBooking, 
  isProcessing = false,
  tripId 
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Book Your Trip
          </DialogTitle>
        </DialogHeader>

        <Elements stripe={stripePromise}>
          <BookingForm 
            bookingDetails={bookingDetails}
            onConfirmBooking={onConfirmBooking}
            isProcessing={isProcessing}
            tripId={tripId}
            onClose={onClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}