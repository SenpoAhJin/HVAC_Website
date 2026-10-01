# Content Update Guide - Quick Reference

**NOTE:** All business information is now centralized in `src/config/contact.js`. Update that file and rebuild - no need to search/replace across multiple files.

---

## Business Information

**File:** `src/config/contact.js`

Update all fields in this single file:

```javascript
export const CONTACT_INFO = {
  PHONE_DISPLAY: '',    // e.g., "(415) 555-0198"
  PHONE_TEL: '',        // e.g., "+14155550198"
  EMAIL: '',            // Your business email
  ADDRESS: '',          // Service area
  HOURS: '',           // Business hours
  DOMAIN: '',          // yourdomain.com (no https://)
  // Social media links
  FACEBOOK: null,
  INSTAGRAM: null,
  LINKEDIN: null,
}
```

**After updating, rebuild:**
```bash
npm run build:greengeeks
```

UI elements automatically hide when values are empty.

---

## Company Story (About Page)

**File:** `src/pages/About.jsx`

**Location:** Lines 31-53

**What to Replace:**
- The entire company story section
- Current content is placeholder with generic text
- Replace with your real founding story, background, and mission

**Keep:**
- The yellow warning box should be REMOVED when you add real content
- Keep the same HTML structure, just replace the text

**Example Structure:**
```jsx
<p className="text-gray-600 mb-6">
  [Your first paragraph about how the business started]
</p>

<p className="text-gray-600 mb-6">
  [Your second paragraph about growth and values]
</p>

<p className="text-gray-600">
  [Your third paragraph about current mission]
</p>
```

---

## Trust Signals (Homepage)

**File:** `src/pages/Home.jsx`

**Location:** Lines 28-32

**Current Values:**
```javascript
const trustSignals = [
  { label: 'Licensed & Insured', value: '✓' },
  { label: 'Years in Business', value: '' },
  { label: '5-Star Reviews', value: '' }
]
```

**Update To:**
```javascript
const trustSignals = [
  { label: 'Licensed & Insured', value: 'License #XXXXX' }, // Your actual license number
  { label: 'Years in Business', value: 'XX+' }, // Your actual years
  { label: '5-Star Reviews', value: 'XXX+' } // Your actual review count from Google/Yelp
]
```

**Note:** Only use real, verifiable numbers. Do not invent statistics.

---

## Adding Photos

**Location:** `Image_Assets/` folder (at project root)

**Current Structure:**
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

**How to Add:**
1. Create folders for your photo categories
2. Add photos to appropriate folders
3. Name files descriptively (e.g., `furnace-install-smith-home.jpg`)
4. Compress images before adding (use tinypng.com or similar)

**Recommended Categories:**
- Installation work (by type: furnace, AC, heat pump)
- Repair/maintenance work
- Team at work
- Service vehicles
- Before/after shots
- Team headshots

---

## Quick Checklist

- [ ] Update `src/config/contact.js` with business info
- [ ] Run `npm run check:placeholders` to verify
- [ ] Update `src/pages/About.jsx` company story
- [ ] Update `src/pages/Home.jsx` trust signals
- [ ] Add photos to `Image_Assets/`
- [ ] Rebuild: `npm run build:greengeeks`

---

## Testing Your Changes

After making updates:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Check each page:**
   - Home page - verify phone, trust signals
   - Services page - verify phone works
   - About page - verify story reads well
   - Contact page - verify all info is correct

3. **Test links:**
   - Click phone number (should open dialer on mobile)
   - Click email (should open email client)
   - Test contact form

---

## Common Mistakes to Avoid

❌ **Don't:**
- Forget to rebuild after updating contact info
- Leave any `[To be specified]` placeholders
- Use uncompressed photos (slows site down)
- Commit `.env.local` file to git (keep secrets secret!)

✅ **Do:**
- Update ALL instances of phone/email
- Compress photos before adding
- Test everything after making changes
- Keep CHANGELOG.md updated with your changes

---

## Need to Add More Content Later?

### Add a New Service
Edit `src/pages/Services.jsx` - add a new object to the `services` array

### Change Color Scheme
Edit `tailwind.config.js` - modify the `warm` and `cool` color values

### Update Footer Links
Edit `src/components/Footer.jsx`

### Add a New Page
1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add link in `src/components/Navbar.jsx`

---

## Getting Help

If you're not comfortable editing code:
1. Hire a developer for 1-2 hours to make updates
2. Use the Find & Replace method (very safe)
3. Test each change immediately in dev mode (`npm run dev`)
4. Keep a backup of original files

---

**Pro Tip:** Make all content updates BEFORE deploying to production. It's easier to test everything at once than to make multiple small updates.

---

**Last Updated:** September 29, 2026
