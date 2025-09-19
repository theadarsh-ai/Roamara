import { LoadingSpinner } from '../LoadingSpinner';

export default function LoadingSpinnerExample() {
  return (
    <div className="space-y-8">
      <LoadingSpinner message="Generating your perfect itinerary..." size="lg" />
      <LoadingSpinner message="Processing payment..." size="md" />
      <LoadingSpinner size="sm" />
    </div>
  );
}