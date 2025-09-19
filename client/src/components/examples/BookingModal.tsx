import { useState } from 'react';
import { BookingModal } from '../BookingModal';
import { Button } from '@/components/ui/button';

const mockBookingDetails = {
  destination: "Rajasthan Heritage Tour",
  duration: "7 Days, 6 Nights",
  totalAmount: 45000,
  breakdown: {
    accommodation: 24000,
    transport: 8500,
    activities: 9000,
    meals: 3500
  }
};

export default function BookingModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmBooking = (paymentInfo: any) => {
    console.log('Booking confirmed with payment info:', paymentInfo);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Open Booking Modal</Button>
      <BookingModal 
        open={isOpen}
        onClose={() => setIsOpen(false)}
        bookingDetails={mockBookingDetails}
        onConfirmBooking={handleConfirmBooking}
      />
    </div>
  );
}