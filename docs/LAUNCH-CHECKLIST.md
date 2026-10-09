# Complete Launch Checklist

This comprehensive checklist ensures your Premier Tech Solution website is fully ready for public launch and maximum impact.

---

## Phase 1: Pre-Launch Content & Configuration

### 1.1 Business Information ✅ (Essential)

- [ ] **Update business contact information**
  - File: `src/config/contact.js`
  - Fill in: phone, email, address, hours, domain
  - All UI elements auto-hide when empty

- [ ] **Verify no placeholder content**
  - Run: `npm run check:placeholders`
  - Fix any flagged issues

### 1.2 About Page Story ⚠️ (Important)

- [ ] **Write company origin story**
  - Who founded the company?
  - When was it founded?
  - What inspired starting the business?
  
- [ ] **Mission statement**
  - What's your core purpose?
  - What makes you different?

- [ ] **Key milestones**
  - Major achievements
  - Company growth
  - Awards/certifications

- [ ] **Remove placeholder content warning box**
  - Delete the yellow warning box after adding real content

**Reference Guide:** See `CONTENT-UPDATE-GUIDE.md` for detailed instructions

---

### 1.3 Visual Assets 📷 (Essential)

- [ ] **Replace placeholder images with real photos**
  - Homepage hero: Team photo or technician at work
  - Services page: Real installation/repair photos
  - About page: Team photos, office, service vehicles

- [ ] **Add company logo** (if available)
  - Current: Text-based "Premier Tech" logo
  - Format: SVG preferred (or high-res PNG)
  - Places: Navbar, Footer, Favicon (optional replacement)

- [ ] **Capture screenshots** for documentation
  - Follow: `screenshots/README.md`
  - 8 screenshots total (desktop/mobile views)

### 1.4 Database & Backend Setup 🔧 (Essential)

- [ ] **Create Supabase project**
  - Sign up at supabase.com (free tier available)
  - Create new project
  - Run `db/supabase-schema.sql` in SQL Editor
  - Confirm RLS is enabled

- [ ] **Get Supabase secret API key**
  - In Supabase: Settings → API → Project API keys
  - Copy the **secret key** (starts with `sb_secret_`)
  - Save the key securely

- [ ] **Decide on Supabase plan**
  - **Free**: Good for low traffic, pauses after 7 days of inactivity (prevented by cron)
  - **Pro ($25/mo)**: Never pauses, daily backups, better for production
  - Recommendation: Start with Free, upgrade when you get 10+ leads/month

- [ ] **Configure email delivery**
  - Create email account in cPanel
  - Check Email Deliverability (SPF, DKIM)
  - Fill in config file with email settings

- [ ] **Set up private config file**
  - Create `/home/username/private_config/premier_tech_config.php`
  - Fill in: Supabase URL, secret key, email addresses, IP hash salt
  - Set permissions to 600

- [ ] **Add cron job for Supabase keep-alive** (if using Free tier)
  - In cPanel: Cron Jobs
  - Schedule: Twice per week (0 0 * * 0,4)
  - Command: `/usr/bin/php /home/studen29/public_html/premiertechsolution.us/api/keepalive.php >> /home/studen29/logs/keepalive.log 2>&1`
  - Create `/home/studen29/logs/` folder first if it doesn't exist
  - Prevents Free tier from pausing

- [ ] **Test contact form**
  - Visit live site after deployment
  - Fill out form with real data
  - Submit and verify email received
  - Check Supabase Table Editor for new lead
  - Delete test lead

---

## Phase 2: Technical Verification

### 2.1 GreenGeeks Deployment

- [ ] **Upload files via FTP/SFTP**
  - Follow: `docs/DEPLOY-GREENGEEKS.md`
  - Upload entire `deploy/` folder contents to public_html

- [ ] **Test production URL**
  - Visit your domain
  - Should load homepage (no white screen)
  - Open DevTools (F12) → Console → No red errors

- [ ] **Verify all pages load**
  - Home: https://yourdomain.com/
  - Services: https://yourdomain.com/services
  - About: https://yourdomain.com/about
  - Contact: https://yourdomain.com/contact

**Reference:** See `docs/DEPLOY-GREENGEEKS.md` for deployment guide

### 2.2 Cross-Browser Testing

Test on multiple browsers and devices:

- [ ] **Desktop Browsers**
  - [ ] Google Chrome (latest)
  - [ ] Mozilla Firefox (latest)
  - [ ] Microsoft Edge (latest)
  - [ ] Safari (if on Mac)

- [ ] **Mobile Browsers**
  - [ ] iOS Safari (iPhone)
  - [ ] Chrome on Android
  - [ ] Samsung Internet (if Android)

- [ ] **Responsive Design**
  - [ ] 320px width (small phones)
  - [ ] 375px width (iPhone)
  - [ ] 768px width (tablets)
  - [ ] 1024px width (small laptops)
  - [ ] 1920px width (desktop)

### 2.3 Performance Testing

- [ ] **Check page load speed**
  - Use tools like: GTmetrix, Pingdom, or WebPageTest
  - First Contentful Paint: <2 seconds
  - Largest Contentful Paint: <3 seconds
  - Time to Interactive: <4 seconds

- [ ] **Optimize if needed**
  - Images: Already optimized (2.7 MB for 23 images is acceptable)
  - JavaScript: 294 KB gzipped (good)
  - CSS: 22 KB gzipped (excellent)

---

## Phase 3: SEO & Discoverability

### 3.1 Google Search Console Setup

- [ ] **Verify site ownership**
  1. Go to: https://search.google.com/search-console
  2. Add property: https://yourdomain.com
  3. Verify via HTML file upload or DNS record

- [ ] **Submit sitemap**
  1. In Search Console → Sitemaps
  2. Submit: https://yourdomain.com/sitemap.xml
  3. Wait for Google to index (1-7 days)

- [ ] **Monitor indexing status**
  - Check Coverage report
  - Verify all 4 pages indexed

### 3.2 Google My Business

- [ ] **Create/claim Google Business Profile**
  1. Visit: https://business.google.com
  2. Add business name: Premier Tech Solution
  3. Choose category: HVAC Contractor
  4. Add address (service area business if no physical location)
  5. Add phone number
  6. Add website URL
  7. Verify business (postcard or phone)

- [ ] **Optimize profile**
  - [ ] Add business hours
  - [ ] Upload photos (office, team, completed work)
  - [ ] Write business description
  - [ ] Add services offered
  - [ ] Enable messaging
  - [ ] Post first update

### 3.3 Local Directories & Citations

Submit business information to these directories:

- [ ] **Yelp for Business**
  - URL: https://biz.yelp.com
  - Create free business account
  - Add photos and business details

- [ ] **Angi (formerly Angie's List)**
  - URL: https://www.angi.com
  - Join as service provider
  - Set up profile

- [ ] **HomeAdvisor**
  - URL: https://www.homeadvisor.com
  - Pro sign-up
  - Complete profile (may require paid membership)

- [ ] **Better Business Bureau**
  - URL: https://www.bbb.org
  - Apply for accreditation (optional, costs $)

- [ ] **Facebook Business Page**
  - Create page if not already have one
  - Add website link
  - Post regularly

- [ ] **Nextdoor Business**
  - URL: https://business.nextdoor.com
  - Claim or create business profile
  - Great for local neighborhood marketing

### 3.4 Social Media Setup

- [ ] **Facebook**
  - Business page created
  - Website link in about section
  - Cover photo and profile picture
  - First post published

- [ ] **Instagram** (optional)
  - Business account
  - Link in bio
  - Before/after photos
  - Behind-the-scenes content

- [ ] **LinkedIn** (optional)
  - Company page
  - Link to website
  - Professional updates

---

## Phase 4: Marketing & Promotion

### 4.1 Announcement Campaign

- [ ] **Email announcement** (if have existing customer list)
  - Subject: "New Website Launch! Check Out Our New Look"
  - Include: Screenshots, new features, special launch offer
  - CTA: Visit website and book service

- [ ] **Social media posts**
  - Facebook, Instagram, LinkedIn
  - Announce new website
  - Showcase features (online contact form, FAQ widget)
  - Include screenshots

- [ ] **Physical marketing materials update**
  - Business cards: Add website URL
  - Vehicle wraps: Add website URL
  - Yard signs: Add website URL
  - Invoices: Add website URL

### 4.2 Launch Promotion Ideas

- [ ] **Limited-time offer**
  - "New Website Launch Special: 15% Off Any Service"
  - "Book Through Our New Website This Month: Free System Check"
  - Creates urgency and drives traffic

- [ ] **Referral program**
  - "Refer a Friend, Get $50 Off Your Next Service"
  - Easy to implement via contact form message

- [ ] **First 50 customers promotion**
  - "First 50 Customers Get [special offer]"
  - Builds momentum

### 4.3 Content Marketing

- [ ] **Blog post ideas** (for future)
  - "5 Signs You Need HVAC Service Before Winter"
  - "How to Improve Your Home's Air Quality"
  - "Heat Pump vs. Traditional HVAC: Which is Right for You?"

- [ ] **Video content** (optional)
  - Virtual tour of a typical service call
  - Meet the team videos
  - Educational content (how to change air filters, etc.)

---

## Phase 5: Analytics & Tracking

### 5.1 Google Analytics Setup

- [ ] **Create GA4 property**
  1. Go to: https://analytics.google.com
  2. Create new property
  3. Get Measurement ID (G-XXXXXXXXXX)

- [ ] **Install tracking code**
  - Add to `index.html` in `<head>` section
  - Or use Google Tag Manager for easier management

- [ ] **Set up conversion goals**
  - Contact form submission
  - Phone number clicks
  - Navigation to Services page

### 5.2 Call Tracking (Optional but Recommended)

- [ ] **Sign up for call tracking service**
  - Options: CallRail ($45/mo), CallTrackingMetrics, DialogTech
  - Get tracking phone number
  - Replace number on website with tracking number

- [ ] **Configure call tracking**
  - Forward calls to real business number
  - Track source (which page/ad generated call)
  - Record calls (with consent) for quality/training

### 5.3 Monitoring Setup

- [ ] **Monitoring setup**
  - Tool: UptimeRobot (free for basic monitoring)
  - Get alerts if site goes down

- [ ] **Performance monitoring**
  - Use GTmetrix or Pingdom for regular performance checks
  - Set up weekly or monthly monitoring

---

## Phase 6: Legal & Compliance

### 6.1 Privacy Policy & Terms

- [ ] **Add Privacy Policy page**
  - Required if collecting any user data
  - Generator: https://www.privacypolicygenerator.info
  - Include: Contact form data, cookies (if using), analytics

- [ ] **Add Terms of Service** (optional but recommended)
  - Generator: https://www.termsofservicegenerator.net
  - Covers: Website usage, disclaimers, liability limits

- [ ] **Link from footer**
  - Add "Privacy Policy" and "Terms of Service" links to footer

### 6.2 Accessibility Compliance

- [ ] **Review WCAG 2.1 Level AA compliance**
  - Already mostly compliant (focus states, alt text, semantic HTML)
  - Test with screen reader (NVDA for Windows, VoiceOver for Mac)

- [ ] **Add accessibility statement** (optional)
  - Commit to accessible web experience
  - Provide contact for accessibility issues

### 6.3 Business Compliance

- [ ] **Verify all claims are accurate**
  - "Licensed and insured" - verify current
  - Years in business - confirm accurate
  - Service area - confirm coverage

- [ ] **Required disclaimers**
  - Pricing estimates (if showing)
  - Service guarantees/warranties (if claiming)

---

## Phase 7: Post-Launch Monitoring

### 7.1 First Week Monitoring

- [ ] **Daily checks**
  - Site uptime (should be 100%)
  - Contact form submissions (test and real)
  - Any error reports from customers

- [ ] **Analytics review**
  - How many visitors?
  - Which pages most popular?
  - Where are visitors coming from?
  - Bounce rate (should be <60%)

### 7.2 First Month Review

- [ ] **Traffic analysis**
  - Total visitors vs. goal
  - Conversion rate (visits → contact form submissions)
  - Most common entry pages

- [ ] **User feedback**
  - Ask customers: "How did you find us?"
  - "Was the website helpful?"
  - Note any confusion or requests

- [ ] **Technical health check**
  - Check page performance with GTmetrix or similar tools
  - Check for any console errors
  - Verify all links still working

### 7.3 Ongoing Optimization

- [ ] **Monthly content updates**
  - Add new photos from recent jobs
  - Update special offers
  - Add customer testimonials

- [ ] **Quarterly reviews**
  - Review analytics trends
  - Update content based on most-viewed pages
  - Plan new features (see PHASE-2-ADVANCED-FEATURES.md)

---

## Quick Launch Checklist (Essential Only)

**Minimum requirements to go live:**

### Content (2-4 hours)
- [ ] Real phone number in all pages
- [ ] Real email address
- [ ] Service area specified
- [ ] Business hours added

### Technical (1-2 hours)
- [ ] Email delivery configured in contact.php
- [ ] Contact form tested and working
- [ ] Production URL loading correctly

### SEO (1 hour)
- [ ] Google Search Console setup
- [ ] Sitemap submitted

### Marketing (1 hour)
- [ ] Google My Business claimed
- [ ] Social media announcement posted

**Total Time to Launch:** 5-8 hours minimum

---

## Extended Launch Checklist (Recommended)

**For maximum impact, add these:**

### Content (6-10 hours)
- [ ] Company story written for About page
- [ ] Real business photos added
- [ ] Trust signals completed (years, reviews)

### SEO (3-5 hours)
- [ ] 5+ directory listings submitted
- [ ] Social media profiles optimized
- [ ] Analytics configured

### Marketing (4-6 hours)
- [ ] Launch promotion planned and announced
- [ ] Email campaign sent (if have list)
- [ ] Physical materials updated with URL

**Total Time for Full Launch:** 18-29 hours

---

## Launch Day Timeline

**Recommended schedule for launch day:**

### Morning (9 AM - 12 PM)
- [ ] Final content review (all placeholder text replaced)
- [ ] Test contact form one more time
- [ ] Verify phone number clickable on mobile
- [ ] Final cross-browser check

### Midday (12 PM - 1 PM)
- [ ] Make site live (or announce if already live)
- [ ] Submit sitemap to Google
- [ ] Post social media announcements

### Afternoon (1 PM - 5 PM)
- [ ] Monitor for any issues
- [ ] Respond to any initial contact form submissions
- [ ] Share website link with team/staff
- [ ] Send email announcement (if applicable)

### Evening (5 PM - 7 PM)
- [ ] Review analytics (initial traffic)
- [ ] Celebrate launch! 🎉

---

## Post-Launch Support Contacts

### Technical Issues
- **Hosting:** GreenGeeks Support (https://www.greengeeks.com/support)
- **Domain:** Your domain registrar support
- **Email:** Your email provider support

### Development Questions
- Review documentation files in project
- Deployment guide: `docs/DEPLOY-GREENGEEKS.md`
- Content updates: `docs/CONTENT-UPDATE-GUIDE.md`

### Future Development
- Review: `PHASE-2-ADVANCED-FEATURES.md`
- Plan quarterly feature additions

---

## Success Metrics (30 Days Post-Launch)

Track these KPIs after launch:

- [ ] **Traffic:** 100+ unique visitors (adjust based on market size)
- [ ] **Contact Form Submissions:** 10+ inquiries
- [ ] **Phone Calls:** Increase in call volume
- [ ] **Google Rankings:** Appear in local 3-pack for "[city] HVAC services"
- [ ] **Bounce Rate:** <60%
- [ ] **Time on Site:** >2 minutes average

---

**Document Version:** 1.0  
**Last Updated:** September 29, 2026  
**Next Review:** 7 days after launch

---

## Ready to Launch?

Once you've completed the "Quick Launch Checklist" section, you're ready to go live!

**Final Pre-Launch Question:** Have you backed up all credentials?
- [ ] Supabase URL and secret key saved securely
- [ ] Email configuration details saved securely
- [ ] FTP/SFTP credentials saved
- [ ] Domain registrar login
- [ ] GitHub repository access
- [ ] IP hash salt value saved

**Post-Launch Security Tasks:**
- [ ] **Rotate Supabase secret key** every 6-12 months (Settings → API → Create new service role key)
- [ ] **Monitor leads** weekly in Supabase Table Editor
- [ ] **Check cron job** monthly to ensure keep-alive is running (if Free tier)
- [ ] **Backup database** monthly (Supabase → Database → Backups → Download)

**Launch the site and start growing your business!** 🚀
