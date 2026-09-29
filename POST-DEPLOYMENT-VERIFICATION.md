# Post-Deployment Verification Guide

## GitHub Pages Deployment Status Check

### Step 1: Check GitHub Actions Workflow

1. Visit: https://github.com/SenpoAhJin/HVAC_Website/actions
2. Look for the latest workflow run (should be triggered by commit `1bc5c0f`)
3. Workflow name: "Deploy to GitHub Pages"
4. Expected status: ✅ Green checkmark (successful)
5. Typical deployment time: 2-4 minutes

**If workflow failed:**
- Click on the failed run
- Review the build logs
- Common issues: npm install errors, build errors, permissions

---

### Step 2: Verify GitHub Pages Settings

1. Visit: https://github.com/SenpoAhJin/HVAC_Website/settings/pages
2. Check **Source** setting:
   - Should be: "GitHub Actions" (not "Deploy from a branch")
   - If set to "Deploy from a branch", change it to "GitHub Actions"
3. Check **Custom domain** (if applicable):
   - Ensure DNS is configured correctly
   - Wait for DNS propagation (up to 48 hours)

---

### Step 3: Test Live GitHub Pages Site

**URL to test:** https://senpoahjin.github.io/HVAC_Website/

#### 3.1 Visual Check
- [ ] Homepage loads (not white screen)
- [ ] All images display correctly
- [ ] Navbar visible with logo and links
- [ ] Footer visible
- [ ] Hero section displays with background image

#### 3.2 Browser DevTools Check
1. Open the site: https://senpoahjin.github.io/HVAC_Website/
2. Press `F12` to open DevTools
3. Click **Console** tab
4. Hard refresh: `Ctrl + Shift + R`

**What to look for:**

✅ **SUCCESS (site working):**
```
No red errors
Or only minor warnings (these are safe):
- "DevTools failed to load source map" (safe to ignore)
- Cookie/tracking warnings (safe to ignore)
```

❌ **FAILURE (still broken):**
```
Red errors like:
- "Failed to load resource: 404" for /assets/index-*.js
- "Failed to load resource: 404" for /assets/index-*.css
- "Uncaught SyntaxError: Unexpected token '<'"
```

#### 3.3 Network Tab Check
1. Stay in DevTools
2. Click **Network** tab
3. Hard refresh: `Ctrl + Shift + R`
4. Look at the list of files loading

**What to check:**
- [ ] `index.html` loads (Status: 200)
- [ ] JavaScript file loads: `/HVAC_Website/assets/index-*.js` (Status: 200)
- [ ] CSS file loads: `/HVAC_Website/assets/index-*.css` (Status: 200)
- [ ] Favicon loads: `/HVAC_Website/favicon.svg` (Status: 200)
- [ ] Images load: `/HVAC_Website/images/Image_Assets/...` (Status: 200)

**If you see Status: 404 for assets:**
- The base path is still incorrect
- Check vite.config.js was updated correctly
- Check GitHub Actions built with the latest code

---

### Step 4: Functional Testing

Once the site loads visually, test all functionality:

#### Navigation
- [ ] Click **Home** link → Navigates to home page
- [ ] Click **Services** link → Navigates to services page
- [ ] Click **About** link → Navigates to about page
- [ ] Click **Contact** link → Navigates to contact page
- [ ] Click logo → Returns to home page
- [ ] All navigation scrolls to top of page

#### Mobile Menu (resize browser to mobile width)
- [ ] Hamburger menu appears (replace desktop nav)
- [ ] Click hamburger → Menu opens with animation
- [ ] Menu links work correctly
- [ ] Click link → Menu closes automatically

#### FAQ Widget
- [ ] Click floating FAQ button (bottom-right) → Widget opens
- [ ] Type in search box → Questions filter correctly
- [ ] Click question → Answer expands with animation
- [ ] Click expanded question → Answer collapses
- [ ] Click close button → Widget closes

#### Contact Form
- [ ] Fill out all fields (name, email, phone, message)
- [ ] Click "Send Message" → Button changes to "Sending..."
- [ ] Without EMAIL_API_KEY configured:
  - [ ] Red error message appears
  - [ ] Message says: "Sorry, there was an error sending your message. Please call us directly at (123) 456-7890."
  - [ ] Form data retained (not cleared)

#### Phone Links
- [ ] Click any "Call Now" button → Opens phone dialer
- [ ] Phone number: (123) 456-7890

#### Visual Effects (Desktop)
- [ ] Hover over nav links → Color changes
- [ ] Hover over buttons → Slight scale increase
- [ ] Hover over service cards → Lift effect (shadow + translate)
- [ ] Tab through elements → Blue focus rings visible

---

### Step 5: Cross-Browser Testing

Test in multiple browsers to ensure compatibility:

**Browsers to test:**
- [ ] Google Chrome (latest)
- [ ] Mozilla Firefox (latest)
- [ ] Microsoft Edge (latest)
- [ ] Safari (if on Mac/iOS)
- [ ] Mobile browsers (iOS Safari, Chrome on Android)

**What to verify:**
- Site loads in all browsers
- Animations work smoothly
- No layout breaks
- Images display correctly

---

### Step 6: Performance Check

Use browser DevTools to check performance:

1. Open DevTools (`F12`)
2. Click **Network** tab
3. Hard refresh (`Ctrl + Shift + R`)
4. Check bottom-right corner for stats

**Expected stats:**
- Total transferred: ~3.0 MB (includes 2.7 MB images)
- Finish time: 2-5 seconds (depends on connection)
- Number of requests: ~30-35

**Performance metrics:**
- First Contentful Paint: <2 seconds
- Largest Contentful Paint: <3 seconds
- Time to Interactive: <4 seconds

---

### Step 7: SEO Verification

Check that SEO elements are present:

#### View Page Source
1. Right-click on page → "View Page Source"
2. Or press `Ctrl + U`

**Verify these tags exist:**
- [ ] `<title>Premier Tech Solution - Expert HVAC Services | Heating & Cooling</title>`
- [ ] `<meta name="description" content="Professional residential HVAC services..."/>`
- [ ] `<meta property="og:title" content="..."/>` (Open Graph)
- [ ] `<meta property="og:image" content="/HVAC_Website/images/..."/>` (has base path)
- [ ] `<link rel="icon" type="image/svg+xml" href="/HVAC_Website/favicon.svg"/>` (has base path)

#### Check Sitemap
- [ ] Visit: https://senpoahjin.github.io/HVAC_Website/sitemap.xml
- [ ] Should show XML file with 4 URLs

#### Check Robots.txt
- [ ] Visit: https://senpoahjin.github.io/HVAC_Website/robots.txt
- [ ] Should show: "User-agent: * / Allow: / / Sitemap: ..."

---

## Comparison Test: Vercel vs GitHub Pages

Both deployments should work identically:

| Feature | Vercel | GitHub Pages |
|---------|--------|--------------|
| URL | https://premier-tech-solution.vercel.app | https://senpoahjin.github.io/HVAC_Website/ |
| Base Path | `/` (root) | `/HVAC_Website/` (subdirectory) |
| Build Source | Same vite.config.js | Same vite.config.js |
| Asset Paths | `/assets/index-*.js` | `/HVAC_Website/assets/index-*.js` |

**Test both URLs and verify:**
- [ ] Both sites load correctly (no white screen)
- [ ] Both have identical layout and design
- [ ] Both have working navigation
- [ ] Both have functional FAQ widget
- [ ] Contact form behaves the same (error without API key)

---

## Common Issues & Solutions

### Issue 1: Still White Screen
**Symptoms:**
- GitHub Pages URL loads but shows blank white page
- DevTools Console shows 404 errors for JS/CSS files

**Causes:**
- Workflow hasn't run yet (check Actions tab)
- Workflow failed (check build logs)
- Base path still incorrect in vite.config.js

**Solutions:**
1. Wait 2-4 minutes for deployment to complete
2. Check Actions tab for workflow status
3. Hard refresh browser: `Ctrl + Shift + R`
4. Clear browser cache
5. If still broken after 10 minutes, check workflow logs

---

### Issue 2: 404 Errors for Assets
**Symptoms:**
- Page loads but images/styles missing
- Console shows 404 for `/assets/*` or `/images/*`

**Cause:**
- Base path not applied correctly during build

**Solution:**
1. Check vite.config.js has correct logic
2. Verify GitHub Actions used latest code
3. Rebuild manually: `npm run build` and check dist/index.html source
4. Re-push and re-deploy

---

### Issue 3: Images Don't Load
**Symptoms:**
- Site loads but images show broken icon
- Console: 404 for image files

**Cause:**
- Images not in public/ directory
- Base path missing from image URLs

**Solution:**
1. Verify images exist: `public/images/Image_Assets/*/`
2. Check image URLs in page source have `/HVAC_Website/` prefix
3. Rebuild and redeploy

---

### Issue 4: Styles Look Broken
**Symptoms:**
- Site loads but looks unstyled (no colors, wrong layout)
- CSS file loads (200) but styles not applied

**Cause:**
- CSS file served with wrong Content-Type
- Tailwind CSS not processing correctly

**Solution:**
1. Check Network tab → CSS file → Headers → Content-Type
2. Should be: `text/css`
3. If wrong, check GitHub Pages settings
4. Rebuild with `npm run build` to regenerate CSS

---

### Issue 5: Workflow Fails
**Symptoms:**
- GitHub Actions shows red X (failed)
- Deployment doesn't complete

**Common Causes & Solutions:**

**Build Error:**
```
Error: Build failed
```
Solution: Check logs for specific error, usually npm install or build issue

**Permission Error:**
```
Error: deployment failed: permission denied
```
Solution: 
1. Go to repo Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Save and re-run workflow

**Node Version Error:**
```
Error: Node version not supported
```
Solution: Check .github/workflows/deploy-gh-pages.yml uses Node 20

---

## Success Criteria Checklist

Your deployment is successful when ALL of these are true:

### Visual
- [✅] Site loads without white screen
- [✅] Homepage displays with hero image and gradient
- [✅] All navigation links visible in navbar
- [✅] All images load correctly (no broken icons)
- [✅] Footer displays at bottom

### Functional
- [✅] All navigation works (Home, Services, About, Contact)
- [✅] Scroll-to-top works on every navigation
- [✅] Mobile menu opens/closes smoothly
- [✅] FAQ widget opens/closes, search filters correctly
- [✅] Contact form shows appropriate error without API key
- [✅] All hover effects work (cards lift, buttons scale)
- [✅] Keyboard navigation works (Tab key, focus rings visible)

### Technical
- [✅] Zero errors in DevTools Console (ignore warnings)
- [✅] All assets load with Status 200 in Network tab
- [✅] JavaScript file loads from `/HVAC_Website/assets/`
- [✅] CSS file loads from `/HVAC_Website/assets/`
- [✅] Images load from `/HVAC_Website/images/`

### Performance
- [✅] Site loads in <5 seconds
- [✅] Animations are smooth (no lag)
- [✅] No JavaScript errors

### SEO
- [✅] Title and meta tags present in page source
- [✅] Sitemap.xml loads
- [✅] Robots.txt loads
- [✅] Favicon displays in browser tab

---

## Monitoring Ongoing Deployments

Every time you push to the `main` branch, GitHub Actions will automatically:

1. Detect the push event
2. Trigger the "Deploy to GitHub Pages" workflow
3. Install dependencies (`npm ci`)
4. Build the project (`npm run build`)
5. Upload the `dist/` folder as artifact
6. Deploy to GitHub Pages

**To monitor:**
- Visit: https://github.com/SenpoAhJin/HVAC_Website/actions
- Watch the workflow run in real-time
- Deployment takes 2-4 minutes typically

---

## Contact Form Email Integration

The contact form is ready but needs configuration:

### Setup EMAIL_API_KEY in Vercel

1. Log in to Vercel dashboard
2. Select project: `premier-tech-solution`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `EMAIL_API_KEY`
   - **Value:** Your API key from Resend/SendGrid/etc.
   - **Environments:** Production, Preview, Development
5. Click **Save**
6. Redeploy: Go to **Deployments** → Click "..." → **Redeploy**

### Test After Setup

1. Visit: https://premier-tech-solution.vercel.app/contact
2. Fill out form with real data
3. Click "Send Message"
4. Should show: ✅ Green success message
5. Check email inbox for received message

---

## Next Steps After Verification

Once both sites are working:

1. **Update Content**
   - Follow: `CONTENT-UPDATE-GUIDE.md`
   - Add real phone number, email, service area
   - Write company story for About page

2. **Add Business Photos**
   - Replace placeholder images with real business photos
   - Follow naming convention in Image_Assets/

3. **Configure Custom Domain** (Optional)
   - Vercel: Settings → Domains → Add domain
   - GitHub Pages: Settings → Pages → Custom domain

4. **Set Up Analytics** (Optional)
   - Google Analytics
   - Vercel Analytics
   - Hotjar for user behavior

5. **Launch Marketing**
   - Share URL on social media
   - Add to Google My Business
   - Submit sitemap to Google Search Console

---

**Last Updated:** September 29, 2026  
**Commit:** 1bc5c0f  
**Deployment:** GitHub Pages + Vercel
