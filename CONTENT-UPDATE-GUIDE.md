# Content Update Guide - Quick Reference

This guide shows exactly where to update common content. Use "Find and Replace" in your code editor for fastest updates.

---

## Phone Number Updates

**Current Placeholder:** `(123) 456-7890` or `tel:+1234567890`

**Files to Update:**

1. `src/components/Navbar.jsx` (line ~55 and ~96)
2. `src/components/Footer.jsx` (line ~39)
3. `src/pages/Home.jsx` (lines ~48, ~149, ~181)
4. `src/pages/Services.jsx` (lines ~96, ~178)
5. `src/pages/Contact.jsx` (lines ~44, ~127)

**Find:** `(123) 456-7890`  
**Replace With:** Your real phone number

**Also Find:** `tel:+1234567890`  
**Replace With:** `tel:+1YOURNUMBER` (no spaces or dashes)

---

## Email Address Updates

**Current Placeholder:** `info@premiertechsolution.com`

**Files to Update:**

1. `src/components/Footer.jsx` (line ~43)
2. `src/pages/Contact.jsx` (lines ~50, ~152)
3. `.env.example` (line ~11)

**Find:** `info@premiertechsolution.com`  
**Replace With:** Your real email address

---

## Service Area Updates

**Current Placeholder:** `[To be specified]`

**Files to Update:**

1. `src/components/Footer.jsx` (line ~49)
2. `src/pages/Contact.jsx` (line ~54)
3. `knowledge-base.txt` (line ~24)

**Find:** `[To be specified]`  
**Replace With:** Your service area (e.g., "Greater Phoenix area including Scottsdale, Mesa, and Tempe")

---

## Business Hours Updates

**Current Placeholder:** `[To be specified]`

**Files to Update:**

1. `src/pages/Contact.jsx` (line ~58)
2. `knowledge-base.txt` (line ~30)

**Find:** `[To be specified]`  
**Replace With:** Your business hours (e.g., "Monday-Friday 8am-6pm, Saturday 9am-4pm")

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
  { label: 'Years in Business', value: '[To be specified]' },
  { label: '5-Star Reviews', value: '[To be specified]' }
]
```

**Update To:**
```javascript
const trustSignals = [
  { label: 'Licensed & Insured', value: 'License #12345' }, // Your real license #
  { label: 'Years in Business', value: '15+' }, // Your actual years
  { label: '5-Star Reviews', value: '200+' } // Your actual review count
]
```

---

## Chatbot Knowledge Base

**File:** `knowledge-base.txt`

**What to Fill Out:**
- Lines 24-26: Service area, phone, email, hours
- Lines 32-34: Heating services details
- Lines 36-38: Cooling services details
- Lines 40-42: Heat pump details
- Lines 44-46: Indoor air quality details
- Lines 52-55: Pricing information
- Lines 61-64: Scheduling details
- Lines 70-74: Emergency service info
- Lines 80-100: FAQs
- Lines 106-110: What makes you different
- Lines 116-118: Payment and financing

**Pro Tip:** Be specific! The more details you provide, the better the chatbot can help customers.

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

## Quick Find & Replace Checklist

Use your code editor's "Find in Files" feature:

- [ ] Find `(123) 456-7890` → Replace with real phone
- [ ] Find `tel:+1234567890` → Replace with real tel: link
- [ ] Find `info@premiertechsolution.com` → Replace with real email
- [ ] Find `[To be specified]` → Replace with real info (each instance might be different)
- [ ] Update `src/pages/About.jsx` company story
- [ ] Update `src/pages/Home.jsx` trust signals
- [ ] Fill out `knowledge-base.txt` completely
- [ ] Add photos to `Image_Assets/`

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

4. **Test chatbot:**
   - Ask questions you expect customers to ask
   - Verify answers are accurate and on-brand

---

## Common Mistakes to Avoid

❌ **Don't:**
- Forget to update tel: links when changing phone number
- Leave any `[To be specified]` placeholders
- Use uncompressed photos (slows site down)
- Skip filling out chatbot knowledge base
- Commit `.env.local` file to git (keep secrets secret!)

✅ **Do:**
- Update ALL instances of phone/email
- Be thorough with chatbot knowledge base
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
