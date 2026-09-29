# Quick Start Guide - Premier Tech Solution Website

Welcome! This guide will get you up and running quickly.

## What Was Built

A complete marketing website with:
- ✅ Home page with diagonal warm/cool hero section
- ✅ Services page with detailed HVAC service descriptions
- ✅ About page (needs your real company story)
- ✅ Contact page with working form
- ✅ AI chatbot widget (needs API key and knowledge base)
- ✅ Responsive design for all devices
- ✅ Accessible keyboard navigation
- ✅ Ready for deployment

## First Steps (Do These Now)

### 1. View the Site Locally

```bash
cd premier-tech-solution
npm install
npm run dev
```

Open http://localhost:5173 in your browser

### 2. Update Critical Info (Before You Forget!)

Search and replace these placeholders throughout the codebase:

- **Phone:** `(123) 456-7890` → your real phone number
- **Email:** `info@premiertechsolution.com` → your real email
- **Service Area:** `[To be specified]` → your actual service area

Files to edit:
- `src/components/Navbar.jsx`
- `src/components/Footer.jsx`
- `src/pages/Home.jsx`
- `src/pages/Services.jsx`
- `src/pages/Contact.jsx`

### 3. Write Your Company Story

Edit `src/pages/About.jsx` and replace the placeholder content with:
- Your real founding story
- Why you started the business
- What makes you different
- Your team's background

## Before Launch (Critical Items)

### A. Fill Out Chatbot Knowledge Base

Edit `knowledge-base.txt` with:
- Your service area
- Your pricing approach
- Your scheduling policy
- Emergency service details
- Common customer questions
- License number and insurance info

### B. Get API Keys

1. **OpenAI (for chatbot):**
   - Go to https://platform.openai.com
   - Sign up and get API key
   - Cost: ~$0.002 per conversation

2. **Email Service (for contact form):**
   - Recommended: https://resend.com (easiest)
   - Or SendGrid: https://sendgrid.com
   - Get API key

### C. Add Your Photos

1. Add your real business photos to `Image_Assets/` folder
2. Organize by category (installation, repair, team, vehicles, etc.)
3. Compress images for web before adding

## Deployment (When Ready)

### Option 1: Quick Deploy to Vercel

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables:
   - `OPENAI_API_KEY`
   - `EMAIL_API_KEY`
   - `TO_EMAIL`
5. Deploy!

See `DEPLOYMENT.md` for detailed instructions.

## Project Structure

```
premier-tech-solution/
├── src/
│   ├── components/      # Navbar, Footer, ChatWidget
│   ├── pages/           # Home, Services, About, Contact
│   └── index.css        # Styles
├── api/                 # Backend functions
│   ├── chat.js          # Chatbot endpoint
│   └── contact.js       # Contact form endpoint
├── Image_Assets/        # Your photos go here
├── knowledge-base.txt   # Chatbot training data
└── CHANGELOG.md         # History of changes
```

## Common Tasks

### Update Phone Number
Search for `(123) 456-7890` and replace everywhere

### Update Services
Edit `src/pages/Services.jsx`

### Add Photos
Add to `Image_Assets/` folder and commit

### Update Chatbot Knowledge
Edit `knowledge-base.txt` and redeploy

### Make Any Code Changes
1. Edit files
2. Test with `npm run dev`
3. Build with `npm run build`
4. Push to GitHub (auto-deploys if using Vercel)

## Getting Help

- **Full documentation:** See `README.md`
- **Deployment guide:** See `DEPLOYMENT.md`
- **Launch checklist:** See `PHASE-2-LAUNCH-CHECKLIST.md`
- **Change history:** See `CHANGELOG.md`

## Next Steps

1. ☐ Update all placeholder content (phone, email, service area)
2. ☐ Write your About page story
3. ☐ Fill out chatbot knowledge base
4. ☐ Add your photos
5. ☐ Get API keys
6. ☐ Test thoroughly
7. ☐ Deploy to Vercel
8. ☐ Test live site
9. ☐ Go through PHASE-2-LAUNCH-CHECKLIST.md
10. ☐ Launch! 🚀

## Questions?

- React docs: https://react.dev
- Tailwind docs: https://tailwindcss.com
- Vercel docs: https://vercel.com/docs

---

**Remember:** The site is fully functional now, but needs your real content before launch. Start with updating phone/email, then work through the Phase 2 Launch Checklist.
