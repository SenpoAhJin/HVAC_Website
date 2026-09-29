# Premier Tech Solution Website

A modern, responsive marketing website for Premier Tech Solution, a residential HVAC company. Built with React, Vite, and Tailwind CSS.

## Features

- ✨ Modern, sleek design with custom warm/cool color scheme
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible (keyboard navigation, focus states, reduced motion support)
- 🤖 AI-powered chatbot for customer questions
- 📧 Working contact form with email delivery
- 🎨 Custom diagonal warm/cool hero section
- 🖼️ Image system ready for local photos

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Backend:** Serverless Functions (Vercel/Netlify compatible)
- **AI:** OpenAI API for chatbot
- **Deployment:** Vercel (recommended) or Netlify

## Project Structure

```
premier-tech-solution/
├── src/
│   ├── components/     # Reusable components (Navbar, Footer, ChatWidget)
│   ├── pages/          # Page components (Home, Services, About, Contact)
│   ├── App.jsx         # Main app with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles + Tailwind
├── api/                # Serverless functions
│   ├── chat.js         # AI chatbot endpoint
│   └── contact.js      # Contact form endpoint
├── Image_Assets/       # Local photos organized by category
├── public/             # Static assets
├── knowledge-base.txt  # Chatbot knowledge base
├── CHANGELOG.md        # Project changelog
└── vercel.json         # Deployment configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env.local` and add your API keys:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## Configuration Required Before Launch

### 1. Business Information (High Priority)

Replace placeholder content throughout the site:

- **Phone number:** Currently `(123) 456-7890` - update in:
  - `src/components/Navbar.jsx`
  - `src/components/Footer.jsx`
  - `src/pages/Home.jsx`
  - `src/pages/Services.jsx`
  - `src/pages/Contact.jsx`

- **Email:** Currently `info@premiertechsolution.com` - update in:
  - `src/components/Footer.jsx`
  - `src/pages/Contact.jsx`

- **Service Area:** Currently `[To be specified]` - update in:
  - `src/components/Footer.jsx`
  - `src/pages/Contact.jsx`
  - `knowledge-base.txt`

### 2. About Page Content (High Priority)

Edit `src/pages/About.jsx` to replace placeholder company story with:
- Real founding story and background
- Actual years in business
- Specific mission and values
- What makes your company unique

### 3. Chatbot Knowledge Base (Critical for Chatbot)

Edit `knowledge-base.txt` and fill in all sections:
- Service area details
- Pricing approach
- Scheduling policies
- Emergency service details
- FAQs specific to your business
- What makes your company different
- License numbers and certifications

### 4. Photos (High Priority)

Add your real photos to `Image_Assets/` folder:
- Create subfolders matching your photo categories
- Supported formats: JPG, PNG, WebP
- Recommended: compress images for web before adding

Current structure from existing photos:
```
Image_Assets/
├── ductless mini split installation/
├── furnace replacement installation/
├── HVAC ductwork installation/
├── HVAC installation team working/
├── HVAC service van tools organized/
├── HVAC technician servicing air handler/
└── rooftop HVAC unit repair/
```

### 5. Trust Signals (Medium Priority)

Update homepage trust signals in `src/pages/Home.jsx`:
- Years in business
- Number of 5-star reviews
- License number
- Any certifications or awards

## Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your repository
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `EMAIL_API_KEY`
   - `TO_EMAIL`
5. Deploy!

### Option 2: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "New site from Git" and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in Site Settings
6. Deploy!

### Environment Variables

Required environment variables for production:

```
OPENAI_API_KEY=sk-...           # For chatbot functionality
EMAIL_API_KEY=...               # For contact form emails
TO_EMAIL=info@example.com       # Where contact form goes
```

## Email Service Setup

The contact form requires an email service. Recommended options:

1. **Resend** (easiest): https://resend.com
   - Free tier: 100 emails/day
   - Good documentation

2. **SendGrid**: https://sendgrid.com
   - Free tier: 100 emails/day
   - Industry standard

3. **Postmark**: https://postmarkapp.com
   - Great deliverability
   - Free trial available

After choosing a service, update `api/contact.js` with the appropriate API integration.

## Chatbot Setup

The chatbot uses OpenAI's GPT-3.5-turbo model:

1. Get API key from https://platform.openai.com
2. Add to environment variables as `OPENAI_API_KEY`
3. Fill out `knowledge-base.txt` with your business information
4. Test thoroughly before launch

**Cost:** ~$0.002 per conversation (very affordable)

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Accessibility

This site follows WCAG 2.1 Level AA guidelines:
- Keyboard navigable
- Screen reader friendly
- Visible focus indicators
- Respects prefers-reduced-motion
- Proper heading hierarchy
- Sufficient color contrast

## Maintenance

See `CHANGELOG.md` for a complete history of changes.

## Support

For technical issues with the website code, refer to:
- React docs: https://react.dev
- Vite docs: https://vitejs.dev
- Tailwind docs: https://tailwindcss.com

## License

Copyright © 2026 Premier Tech Solution. All rights reserved.
