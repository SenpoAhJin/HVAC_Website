# Manual Test Checklist - Phase 1.8

**Test Date**: September 29, 2026  
**Live URL**: https://premier-tech-solution.vercel.app  
**Latest Commit**: f8af6d9

## IMPORTANT NOTE

This checklist must be completed by the owner in a real browser. Automated browser testing was attempted but timed out. The scroll-to-top fix has been implemented with:

- `useLayoutEffect` instead of `useEffect` for immediate scroll before paint
- Explicit `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`
- Reset of `document.documentElement.scrollTop` and `document.body.scrollTop`
- Hash navigation support (scrolls to element if URL has #hash)
- 404 Not Found page added for unknown routes

## Test Environment Setup

- Browser: Chrome/Edge (latest version)
- Desktop viewport: 1440x900 or similar
- Mobile viewport: 390x844 (iPhone 12 Pro) or use DevTools device emulation

---

## 1. SCROLL-TO-TOP TESTS

Test against **live Vercel URL**: https://premier-tech-solution.vercel.app

### Desktop (1440px width)

| Test Step | Action | Expected | scrollY After | PASS/FAIL |
|-----------|--------|----------|---------------|-----------|
| 1 | Load home page | Page loads | 0 | |
| 2 | Scroll down 800px | Page scrolls | ~800 | |
| 3 | Click "Services" nav link | Navigate to Services | **0** | |
| 4 | Scroll down 600px | Page scrolls | ~600 | |
| 5 | Click "About" nav link | Navigate to About | **0** | |
| 6 | Scroll down 500px | Page scrolls | ~500 | |
| 7 | Click "Contact" nav link | Navigate to Contact | **0** | |
| 8 | Press browser Back button | Navigate to About | **0** | |
| 9 | Press browser Forward button | Navigate to Contact | **0** | |
| 10 | Scroll to footer, click Services footer link | Navigate to Services | **0** | |
| 11 | Click logo in navbar | Navigate to Home | **0** | |

**How to check scrollY**: Open browser console (F12), type `window.scrollY` and press Enter.

### Mobile (390px width)

| Test Step | Action | Expected | scrollY After | PASS/FAIL |
|-----------|--------|----------|---------------|-----------|
| 1 | Load home page (mobile view) | Page loads | 0 | |
| 2 | Open mobile menu (hamburger) | Menu opens | | |
| 3 | Scroll down 500px | Page scrolls | ~500 | |
| 4 | Click "Services" in mobile menu | Navigate + menu closes | **0** | |
| 5 | Scroll down 400px | Page scrolls | ~400 | |
| 6 | Open mobile menu, click "Contact" | Navigate + menu closes | **0** | |
| 7 | Press browser Back button | Navigate to Services | **0** | |

---

## 2. NAVBAR FUNCTIONALITY

### Desktop

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Logo | Click | Navigate to Home | |
| Home link | Click | Navigate to Home | |
| Services link | Click | Navigate to Services | |
| About link | Click | Navigate to About | |
| Contact link | Click | Navigate to Contact | |
| Phone button | Click | Opens tel: link or shows number | |
| Active link highlight | Navigate between pages | Current page link highlighted | |

### Mobile (< 768px)

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Hamburger icon | Click | Menu opens (slide down animation) | |
| Logo (menu open) | Visible | Logo still visible | |
| Close icon | Click | Menu closes | |
| Home link (in menu) | Click | Navigate + menu closes | |
| Services link (in menu) | Click | Navigate + menu closes | |
| About link (in menu) | Click | Navigate + menu closes | |
| Contact link (in menu) | Click | Navigate + menu closes | |
| Phone button (in menu) | Click | Opens tel: link | |
| Background overlay | Click outside menu | Menu closes | |

---

## 3. HOME PAGE - CTAs AND CARDS

| Element | Location | Action | Expected Destination | PASS/FAIL |
|---------|----------|--------|---------------------|-----------|
| Hero CTA | Hero section | Click "Get Started" | /contact | |
| Emergency banner CTA | Top banner | Click "Call Now" | tel: link | |
| Service card - Heating | Services section | Click card | /services | |
| Service card - Cooling | Services section | Click card | /services | |
| Service card - Heat Pumps | Services section | Click card | /services | |
| Service card - Air Quality | Services section | Click card | /services | |
| Service card - Maintenance | Services section | Click card | /services | |
| Service card - Repair | Services section | Click card | /services | |
| "View All Services" button | Services section | Click | /services | |
| "Get in Touch" CTA | Bottom section | Click | /contact | |

---

## 4. SERVICES PAGE

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Page loads | Visit /services | Content displays | |
| Service cards | Hover | Card lifts (hover effect) | |
| "Contact Us" CTA | Click | Navigate to /contact | |
| All images | Check | Images load properly | |

---

## 5. ABOUT PAGE

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Page loads | Visit /about | Content displays | |
| Team member cards | Hover | Hover effect (if any) | |
| "Get Started" CTA | Click | Navigate to /contact | |
| All images | Check | Images load properly | |

---

## 6. CONTACT PAGE

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Page loads | Visit /contact | Form displays | |
| Name field | Leave empty, submit | Validation error | |
| Email field | Enter invalid email, submit | Validation error | |
| Email field | Enter valid email | Accepts input | |
| Phone field | Enter text | Only numbers allowed | |
| Message field | Leave empty, submit | Validation error | |
| Submit button | Click (empty form) | Shows validation errors | |
| Submit button | Click (valid form) | Shows loading state | BLOCKED* |
| Form submission | Submit valid form | Success/error message | BLOCKED* |

\* **BLOCKED**: Backend API or email configuration required. Mark as BLOCKED, not PASS.

---

## 7. FAQ SECTION (if present)

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Search box | Type query | Filters FAQ items | |
| Search box | Type "xyz123" | Shows "No results" message | |
| FAQ item | Click to expand | Content reveals smoothly | |
| FAQ item | Click to collapse | Content hides smoothly | |
| FAQ item | Tab key navigation | Focusable with keyboard | |
| FAQ item | Press Enter key | Expands/collapses | |
| FAQ item | Press Escape key | Collapses if open | |
| Multiple items | Expand several | All can be open at once OR only one open | |

Test all 10 FAQ questions (if applicable):
1. [ ] Question 1 expands/collapses
2. [ ] Question 2 expands/collapses
3. [ ] Question 3 expands/collapses
4. [ ] Question 4 expands/collapses
5. [ ] Question 5 expands/collapses
6. [ ] Question 6 expands/collapses
7. [ ] Question 7 expands/collapses
8. [ ] Question 8 expands/collapses
9. [ ] Question 9 expands/collapses
10. [ ] Question 10 expands/collapses

---

## 8. FOOTER

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Home link | Click | Navigate to / | |
| Services link | Click | Navigate to /services | |
| About link | Click | Navigate to /about | |
| Contact link | Click | Navigate to /contact | |
| Phone link | Click | Opens tel: link | |
| Email link | Click | Opens mailto: link | |
| External links | Click | Opens in new tab with noopener | |
| Social media icons | Check | Display correctly | |

---

## 9. PHONE CALL BUTTON/LINK

**Desktop behavior**:

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Phone button (navbar) | Click | Check actual href attribute | |
| Phone button (navbar) | Click | Desktop: display number OR open tel: | |
| Phone button (hero) | Click | Desktop: display number OR open tel: | |
| Phone link (footer) | Click | Desktop: display number OR open tel: | |

**Mobile behavior** (use DevTools device emulation):

| Element | Action | Expected Result | PASS/FAIL |
|---------|--------|-----------------|-----------|
| Phone button (navbar) | Click | Mobile: opens phone dialer (tel:) | |
| Phone button (hero) | Click | Mobile: opens phone dialer (tel:) | |
| Phone link (footer) | Click | Mobile: opens phone dialer (tel:) | |

**Actual href check**: Use browser inspector to verify href="tel:+1234567890" format.

---

## 10. 404 NOT FOUND PAGE

| Test | Action | Expected Result | PASS/FAIL |
|------|--------|-----------------|-----------|
| Unknown URL | Visit /does-not-exist | Shows 404 page | |
| 404 page content | Check page | Shows "404", "Page Not Found" message | |
| Back to Home link | Click | Navigate to / | |
| 404 page style | Visual check | Matches site theme | |

---

## 11. EXTERNAL LINKS

Find all external links (e.g., social media, partner sites) and verify:

| Link | Location | Opens in New Tab | rel="noopener noreferrer" | PASS/FAIL |
|------|----------|------------------|---------------------------|-----------|
| (List external links found) | | | | |

**How to check**: Right-click link → Inspect → verify `target="_blank"` and `rel="noopener noreferrer"`.

---

## 12. ACCESSIBILITY - KEYBOARD NAVIGATION

| Test | Action | Expected Result | PASS/FAIL |
|------|--------|-----------------|-----------|
| Tab navigation | Press Tab repeatedly | Focus moves through all interactive elements | |
| Skip links | Tab on page load | Skip-to-content link appears (if present) | |
| Focus indicators | Tab through page | Visible focus ring on all elements | |
| Enter key | Focus on button, press Enter | Activates button | |
| Space key | Focus on button, press Space | Activates button | |
| Escape key | Open mobile menu, press Escape | Menu closes | |

---

## SUMMARY TEMPLATE

After completing all tests, fill in:

**Total Tests**: ___  
**Passed**: ___  
**Failed**: ___  
**Blocked**: ___  
**Not Tested**: ___

**Critical Failures** (list any):
- 

**Scroll-to-Top Status**: PASS / FAIL  
(If FAIL, list which navigation actions failed to scroll to top)

**Notes**:


---

## How to Report Results

Take screenshots of any failures and save to `/screenshots` directory with descriptive names:
- `failure-scroll-services.png`
- `failure-mobile-menu-not-closing.png`
- etc.

Update the PASS/FAIL columns in this document and save.
