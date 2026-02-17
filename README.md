# AI Interview System

A modern, professional UI for an AI-powered interview platform built with Next.js (App Router) and Tailwind CSS.

## Features

- 🤖 **AI-Powered Interviews**: Seamless integration with AI interview systems
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, minimal design inspired by Stripe and Notion
- 🎯 **User-Friendly**: Intuitive interface for both candidates and administrators
- 🔐 **Secure**: Built with security and privacy in mind
- ⚡ **Fast**: Optimized for performance with modern React patterns

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)

## Project Structure

```
app/
├── components/
│   ├── ui/
│   │   ├── Button.js           # Reusable button component
│   │   ├── Card.js             # Card container component
│   │   ├── Loader.js           # Loading spinners and skeletons
│   │   └── StatusIndicator.js  # Interview status indicators
│   └── layout/
│       └── InterviewLayout.js  # Shared layout for interview pages
├── interview/
│   └── [token]/
│       ├── page.js             # Interview link validation
│       ├── verify/
│       │   └── page.js         # Identity verification
│       ├── instructions/
│       │   └── page.js         # Pre-interview instructions
│       ├── interview/
│       │   └── page.js         # Live interview interface
│       └── complete/
│           └── page.js         # Post-interview completion
├── globals.css                 # Global styles and Tailwind imports
├── layout.js                   # Root layout with metadata
└── page.js                     # Landing page
```

## Interview Flow

1. **Landing Page** (`/`) - Home page with feature overview
2. **Interview Link** (`/interview/[token]`) - Token validation and candidate info
3. **Verification** (`/interview/[token]/verify`) - Email/OTP verification
4. **Instructions** (`/interview/[token]/instructions`) - Pre-interview setup
5. **Interview** (`/interview/[token]/interview`) - Live AI interview
6. **Completion** (`/interview/[token]/complete`) - Success and feedback

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd interview-agent
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Tokens

For testing purposes, you can use these demo tokens:

- `demo-valid` - Valid interview link with sample candidate data
- `expired` - Expired interview link scenario  
- `invalid` - Invalid interview link scenario

## Component Documentation

### UI Components

#### Button
```jsx
import Button from './components/ui/Button';

<Button 
  variant="primary"    // primary, secondary, outline, ghost, danger
  size="md"           // sm, md, lg
  loading={false}
  disabled={false}
>
  Click me
</Button>
```

#### Card
```jsx
import Card from './components/ui/Card';

<Card 
  padding="md"        // none, sm, md, lg
  hover={false}       // Enable hover animations
  className="custom-class"
>
  Content
</Card>
```

#### StatusIndicator
```jsx
import StatusIndicator from './components/ui/StatusIndicator';

<StatusIndicator 
  status="listening"  // listening, speaking, paused, idle
  size="md"          // sm, md, lg
  showLabel={true}
/>
```

### Layout Components

#### InterviewLayout
```jsx
import InterviewLayout from './components/layout/InterviewLayout';

<InterviewLayout
  title="Page Title"
  subtitle="Page subtitle"
  showProgress={true}
  currentStep={1}
  totalSteps={5}
>
  Page content
</InterviewLayout>
```

## Styling Guidelines

- Uses Tailwind CSS for utility-first styling
- Custom animations with Framer Motion
- Consistent spacing scale (4px base unit)
- Professional color palette (grays, blues)
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)

## Browser Support

- Chrome/Chromium 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Performance

- Optimized bundle size with tree-shaking
- Lazy loading for routes
- Efficient re-renders with React best practices
- Minimal external dependencies

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast color ratios
- Focus management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team.
