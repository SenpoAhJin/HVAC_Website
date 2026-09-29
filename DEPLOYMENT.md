# Deployment Guide - Premier Tech Solution Website

This guide walks through deploying your website to production.

## Pre-Deployment Checklist

Before deploying, ensure you have completed:

- [ ] Updated all phone numbers from placeholder
- [ ] Updated all email addresses
- [ ] Added real service area information
- [ ] Replaced About page placeholder content with real story
- [ ] Filled out `knowledge-base.txt` for chatbot
- [ ] Added your business photos to `Image_Assets/`
- [ ] Tested the site locally (`npm run dev`)
- [ ] Built the site successfully (`npm run build`)
- [ ] Have a GitHub account
- [ ] Have API keys ready (OpenAI, email service)

## Step 1: Push to GitHub

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Premier Tech Solution website"
```

2. Create a new repository on GitHub.com:
   - Go to github.com and click "New repository"
   - Name it `premier-tech-solution`
   - Keep it private (recommended)
   - Don't initialize with README (you already have one)

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/premier-tech-solution.git
git branch -M main
git push -u origin main
```

## Step 2: Get API Keys

### OpenAI API Key (for chatbot)

1. Go to https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy and save the key (starts with `sk-`)
6. **Cost:** Pay-as-you-go, ~$0.002 per conversation

### Email Service API Key (for contact form)

Choose one option:

#### Option A: Resend (Recommended - Easiest)

1. Go to https://resend.com
2. Sign up for free account
3. Verify your email
4. Go to API Keys section
5. Copy your API key
6. **Free tier:** 100 emails/day

#### Option B: SendGrid

1. Go to https://sendgrid.com
2. Sign up for free account
3. Complete verification
4. Go to Settings > API Keys
5. Create new API key with "Mail Send" permissions
6. Copy the key
7. **Free tier:** 100 emails/day

## Step 3: Deploy to Vercel (Recommended)

### Why Vercel?
- Free tier is generous
- Automatic deployments from GitHub
- Serverless functions work out of the box
- Excellent performance

### Deployment Steps

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Click "Sign Up" and use GitHub to sign in

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your `premier-tech-solution` repository
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Leave these as default (Vercel auto-detects)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   OPENAI_API_KEY = sk-your-actual-key-here
   EMAIL_API_KEY = your-email-service-key-here
   TO_EMAIL = info@premiertechsolution.com
   ```

   **Important:** Add these to all environments (Production, Preview, Development)

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://premier-tech-solution.vercel.app`

6. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., premiertechsolution.com)
   - Follow Vercel's instructions to update DNS records

## Step 4: Configure Email Service Integration

If you chose Resend, update `api/contact.js`:

```javascript
// Install resend package
// npm install resend

import { Resend } from 'resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, phone, message } = req.body

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const resend = new Resend(process.env.EMAIL_API_KEY)
    
    await resend.emails.send({
      from: 'noreply@premiertechsolution.com', // Must be verified domain or use Resend's test domain
      to: process.env.TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
```

Then redeploy:
```bash
git add .
git commit -m "Configure email service"
git push
```

Vercel will automatically redeploy.

## Step 5: Test Your Live Site

1. **Test Navigation:**
   - Visit all pages (Home, Services, About, Contact)
   - Check mobile responsiveness
   - Test all links

2. **Test Contact Form:**
   - Submit a test message
   - Verify you receive the email
   - Check spam folder if not in inbox

3. **Test Chatbot:**
   - Click chat button
   - Ask a question
   - Verify it responds (may be generic if knowledge base not filled)

4. **Test Performance:**
   - Use Google PageSpeed Insights: https://pagespeed.web.dev
   - Aim for 90+ score

## Step 6: Update Chatbot Knowledge Base

To update what the chatbot knows:

1. Edit `knowledge-base.txt` locally with all your business info
2. Copy the content
3. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
4. Add new variable:
   - **Name:** `CHATBOT_KNOWLEDGE`
   - **Value:** Paste entire knowledge-base.txt content
5. Save and redeploy

Alternatively, modify `api/chat.js` to read from a file or database.

## Step 7: Set Up Custom Domain (Optional but Recommended)

1. **Purchase Domain:**
   - Use Namecheap, GoDaddy, or Google Domains
   - Recommended: `premiertechsolution.com`

2. **Add to Vercel:**
   - Vercel Dashboard → Domains → Add Domain
   - Enter your domain name
   - Vercel will show DNS records to add

3. **Update DNS:**
   - Go to your domain registrar
   - Add the A/CNAME records Vercel provided
   - Wait for DNS propagation (5 minutes to 24 hours)

4. **SSL Certificate:**
   - Vercel automatically provisions SSL
   - Your site will be HTTPS

## Ongoing Maintenance

### Making Updates

1. Edit files locally
2. Test with `npm run dev`
3. Commit changes:
```bash
git add .
git commit -m "Description of changes"
git push
```
4. Vercel automatically redeploys
5. Update CHANGELOG.md with each change

### Monitoring

- Check Vercel Analytics for traffic
- Monitor chatbot usage via OpenAI dashboard
- Review email delivery rates
- Check for any error logs in Vercel

### Updating Content

- **Phone/Email:** Edit source files and push
- **Photos:** Add to Image_Assets, commit, push
- **Services:** Edit `src/pages/Services.jsx`
- **About Story:** Edit `src/pages/About.jsx`
- **Chatbot:** Update knowledge base environment variable

## Troubleshooting

### Chatbot not working
- Check OPENAI_API_KEY is set in Vercel
- Verify API key is valid at platform.openai.com
- Check Vercel function logs for errors

### Contact form not sending emails
- Verify EMAIL_API_KEY is set
- Check email service dashboard for sending errors
- Verify TO_EMAIL is correct
- Check spam folder

### Build fails
- Check Vercel build logs
- Run `npm run build` locally to reproduce
- Ensure all dependencies are in package.json

### Images not loading
- Verify image paths are correct
- Check file names match (case-sensitive)
- Ensure images are committed to git

## Cost Estimate

**Free tier is sufficient for starting out:**

- Vercel: Free (up to 100GB bandwidth/month)
- OpenAI: ~$5-20/month (depends on chatbot usage)
- Email (Resend): Free (100 emails/day)
- Domain: ~$10-15/year

**Total: ~$10-30/month after domain purchase**

## Support

If you encounter issues:

1. Check Vercel documentation: https://vercel.com/docs
2. React documentation: https://react.dev
3. Tailwind CSS: https://tailwindcss.com
4. Create GitHub issue in your repository

## Security Notes

- Never commit `.env.local` file (it's in .gitignore)
- Keep API keys secure
- Rotate keys if accidentally exposed
- Use environment variables for all secrets
- Keep dependencies updated: `npm update`

---

**Congratulations!** Your website is now live. Don't forget to:
- Share the URL with customers
- Add to Google Business Profile
- Submit sitemap to Google Search Console
- Monitor analytics and customer feedback
