import { HeroSection } from '../HeroSection';

export default function HeroSectionExample() {
  const handleGetStarted = () => {
    console.log('Get started clicked');
  };

  return <HeroSection onGetStarted={handleGetStarted} />;
}