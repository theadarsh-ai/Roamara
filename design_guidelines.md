# AI Trip Planner Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from Airbnb's travel-focused design patterns and Google Maps' intuitive navigation, emphasizing visual storytelling and seamless user flows for travel planning.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Light Mode: 220 85% 25% (Deep travel blue)
- Dark Mode: 220 75% 85% (Light blue-white)

**Accent Colors:**
- Warm coral: 15 75% 65% for CTAs and highlights
- Success green: 140 60% 50% for confirmations

**Background Treatments:**
Subtle gradients from primary blue to lighter variants for hero sections and cards. Warm coral accents used sparingly for booking CTAs and progress indicators.

### Typography
- **Primary**: Inter (Google Fonts) - Clean, modern readability
- **Display**: Poppins (Google Fonts) - Hero headings and emphasis
- **Body**: 16px base, 1.5 line height for optimal reading

### Layout System
**Tailwind Spacing**: Consistent use of 4, 8, 16, and 24 units (p-4, m-8, gap-16, py-24) for harmonious spacing throughout the application.

### Component Library

**Navigation:**
- Sticky header with destination search bar
- Mobile hamburger menu with slide-out drawer
- Breadcrumb navigation for multi-step planning

**Forms & Input:**
- Progressive disclosure forms for trip preferences
- Slider components for budget and duration
- Tag-based interest selection with visual icons
- Date picker with calendar integration

**Data Display:**
- Interactive timeline cards for itinerary items
- Cost breakdown cards with visual budget meters
- Map integration with custom markers
- Weather and real-time condition widgets

**Trip Planning Interface:**
- Drag-and-drop itinerary builder
- Collapsible day-by-day sections
- Quick-edit modals for activity adjustments
- Shareable trip summary cards

**Booking & Payment:**
- Prominent "Book This Trip" CTA buttons (variant="outline" with blurred backgrounds when over images)
- Payment progress stepper
- Confirmation screens with trip details

### Images
Hero section features a large, inspiring travel destination image (1920x800px) with gradient overlay for text readability. Secondary images showcase Indian destinations, cultural activities, and transportation options throughout the interface. All images use rounded corners (rounded-lg) for modern aesthetic.

### Animations
Minimal, purposeful animations:
- Smooth page transitions
- Gentle hover states on interactive elements
- Progress indicators during AI generation
- No distracting or excessive motion

### Accessibility
Consistent dark mode implementation across all components including form inputs. High contrast ratios maintained. Touch-friendly button sizes (minimum 44px). Screen reader optimized with proper ARIA labels.

This design prioritizes user trust through clean aesthetics while maintaining the excitement of travel discovery through strategic use of imagery and color.