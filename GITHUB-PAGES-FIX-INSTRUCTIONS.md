# GitHub Pages Not Working - Fix Instructions

## Current Status (as of commit 1068e99)

**Problem:** https://senpoahjin.github.io/HVAC_Website/ returns empty content (53 bytes)

**Local Build:** ✓ Works perfectly
**Vercel:** ✓ Should work (base path `/`)
**GitHub Pages:** ❌ Not deploying

---

## ROOT CAUSE

The GitHub Pages deployment is not configured correctly in the repository settings.

---

## FIX: Configure GitHub Pages Source

### Step 1: Check Repository Settings

1. Go to: https://github.com/SenpoAhJin/HVAC_Website/settings/pages
2. Look at the **"Source"** dropdown

### Step 2: Set Source to GitHub Actions

**If Source is set to "Deploy from a branch":**
- This is the OLD method and our workflow won't run
- Change it to: **"GitHub Actions"**
- Save

**If Source is already "GitHub Actions":**
- Check the Actions tab: https://github.com/SenpoAhJin/HVAC_Website/actions
- Look for failed workflows or permission errors

### Step 3: Check Workflow Permissions

1. Go to: https://github.com/SenpoAhJin/HVAC_Website/settings/actions
2. Scroll to "Workflow permissions"
3. Select: **"Read and write permissions"**
4. Check: **"Allow GitHub Actions to create and approve pull requests"**
5. Save

### Step 4: Trigger Manual Deploy

1. Go to: https://github.com/SenpoAhJin/HVAC_Website/actions
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait 2-3 minutes

### Step 5: Verify Deployment

1. Check workflow completes with green checkmark
2. Visit: https://senpoahjin.github.io/HVAC_Website/
3. Should see homepage, not blank screen

---

## If Still Not Working: Alternative Method

### Option A: Use gh-pages Branch (Legacy Method)

```powershell
# Install gh-pages package
npm install --save-dev gh-pages

# Add deploy script to package.json
```

In `package.json`, add:
```json
"scripts": {
  "deploy": "npm run build && npx gh-pages -d dist"
}
```

Then run:
```powershell
npm run deploy
```

Go to Settings → Pages → Source → select "Deploy from a branch" → Branch: `gh-pages` → Folder: `/ (root)`

### Option B: Check for 404.html Issue

The site might be redirecting incorrectly. Check if visiting:
https://senpoahjin.github.io/HVAC_Website/index.html

Works differently than:
https://senpoahjin.github.io/HVAC_Website/

---

## Expected Working URLs After Fix

1. **Homepage:** https://senpoahjin.github.io/HVAC_Website/
2. **Services:** https://senpoahjin.github.io/HVAC_Website/services
3. **About:** https://senpoahjin.github.io/HVAC_Website/about
4. **Contact:** https://senpoahjin.github.io/HVAC_Website/contact

All images should load with URLs like:
https://senpoahjin.github.io/HVAC_Website/images/services/heating-service.jpg

---

## Verification Checklist

After making changes:

- [ ] GitHub Actions workflow runs successfully
- [ ] Homepage loads (not blank)
- [ ] All 4 pages accessible
- [ ] Images display on Services page
- [ ] No console errors in browser DevTools (F12)
- [ ] Navbar links work
- [ ] Contact form displays

---

## Technical Details

### Current Configuration:
- **Vite base:** `/HVAC_Website/` (when VERCEL env var not set)
- **Build output:** `dist/` directory
- **Workflow:** `.github/workflows/deploy-gh-pages.yml`
- **Repository name:** `HVAC_Website` (case-sensitive!)

### Why It Should Work:
1. Workflow triggers on push to main ✓
2. Workflow has correct permissions set ✓
3. Builds to dist/ with correct base path ✓
4. Uploads dist/ as artifact ✓
5. Deploys artifact to Pages ✓

The ONLY missing piece is the GitHub Pages source configuration.

---

## Contact for Help

If after following these steps it still doesn't work:

1. Check Actions tab for error messages
2. Look at workflow logs for specific failures
3. Verify repository Settings → Pages shows "Your site is live at..."
4. Check browser console (F12) for JavaScript errors on the live site

The problem is almost certainly in repository settings, not the code.
