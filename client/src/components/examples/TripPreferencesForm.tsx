import { TripPreferencesForm } from '../TripPreferencesForm';

export default function TripPreferencesFormExample() {
  const handleSubmit = (preferences: any) => {
    console.log('Form submitted with preferences:', preferences);
  };

  return <TripPreferencesForm onSubmit={handleSubmit} />;
}