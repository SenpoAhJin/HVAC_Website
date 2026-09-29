# How to Start the Development Server

This guide will walk you through starting the Premier Tech Solution website on your local machine for testing and development.

---

## Prerequisites

Before you begin, make sure you have these installed:

### 1. Node.js (Version 18 or higher)

**Check if installed:**
```bash
node --version
```

**If not installed:**
- Download from https://nodejs.org
- Choose the **LTS** (Long Term Support) version
- Run the installer and follow the prompts
- Restart your terminal/command prompt after installation

### 2. Git (for version control)

**Check if installed:**
```bash
git --version
```

**If not installed:**
- Download from https://git-scm.com
- Run the installer with default settings

---

## Step-by-Step: Starting the Development Server

### Step 1: Open Terminal/Command Prompt

**On Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**Or use VS Code:**
- Open VS Code
- Press `` Ctrl + ` `` (backtick) to open terminal

### Step 2: Navigate to Project Directory

```bash
cd C:\Users\Alord\OneDrive\Documents\Work\HVAC\premier-tech-solution
```

**Tip:** You can type `cd` followed by a space, then drag the folder into the terminal window to auto-fill the path.

### Step 3: Install Dependencies (First Time Only)

If this is your first time running the project, install all required packages:

```bash
npm install
```

**What this does:** Downloads all the libraries and tools the website needs to run.

**Wait time:** 1-3 minutes depending on your internet speed.

**You'll see:** A progress bar and lots of text scrolling by. This is normal!

### Step 4: Start the Development Server

```bash
npm run dev
```

**What this does:** Starts a local web server that hosts your website.

**You'll see something like:**
```
VITE v8.3.1  ready in 281 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 5: Open the Website in Your Browser

1. Look for the line that says `Local: http://localhost:5173/` (the port number might be different like 5174, 5175, etc.)
2. **Hold Ctrl** and **click** the link (in most terminals this opens it automatically)
   
   **OR**
   
3. Copy the URL and paste it into your web browser

**Success!** You should now see the Premier Tech Solution website running locally.

---

## What You Can Do Now

### ✅ Test All Pages
- Click through all navigation links (Home, Services, About, Contact)
- Test the FAQ widget (click the button in bottom-right corner)
- Try the contact form
- Resize your browser window to test mobile responsiveness

### ✅ Make Changes
- Edit files in the `src/` directory
- **Changes appear automatically!** The page will refresh when you save a file
- This is called "Hot Module Replacement" (HMR)

### ✅ View in Mobile Size
1. Press `F12` in your browser to open Developer Tools
2. Click the phone/tablet icon (or press `Ctrl + Shift + M`)
3. Select different device sizes from the dropdown

---

## How to Stop the Server

When you're done testing:

1. Go back to your terminal/command prompt
2. Press `Ctrl + C`
3. Type `y` if prompted "Terminate batch job? (Y/N)"

**The server is now stopped.** Your website is no longer accessible at localhost.

---

## Common Issues & Solutions

### Issue: "Port 5173 is in use"

**What happened:** The port is already taken by another program.

**Solution:** Vite will automatically try the next port (5174, 5175, etc.). Just use that new port number.

**Or manually stop the other process:**
```bash
# On Windows
netstat -ano | findstr :5173
taskkill /PID [process_id] /F
```

### Issue: "npm: command not found" or "'npm' is not recognized"

**What happened:** Node.js is not installed or not in your system PATH.

**Solution:**
1. Install Node.js from https://nodejs.org
2. Restart your terminal/command prompt
3. Try again

### Issue: "Error: Cannot find module"

**What happened:** Dependencies are not installed.

**Solution:**
```bash
npm install
```

### Issue: Website shows "Cannot GET /"

**What happened:** You're looking at the wrong URL or the server isn't running.

**Solution:**
1. Make sure `npm run dev` is running in your terminal
2. Use the exact URL shown in your terminal (usually http://localhost:5173/)

### Issue: Changes not appearing

**What happened:** Sometimes HMR gets stuck.

**Solution:**
1. Save your file again (Ctrl + S)
2. Manually refresh browser (F5 or Ctrl + R)
3. If still stuck, stop server (Ctrl + C) and restart (`npm run dev`)

### Issue: "ENOSPC: System limit for number of file watchers reached"

**What happened:** Too many files being watched (Linux/Mac issue).

**Solution (Linux/Mac):**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Testing Checklist

Use this checklist when testing the site:

- [ ] Homepage loads correctly
- [ ] All images display (no broken image icons)
- [ ] Navigation menu works on all pages
- [ ] Mobile menu opens and closes (test on small screen)
- [ ] FAQ widget opens and closes
- [ ] FAQ search filters questions
- [ ] FAQ answers expand when clicked
- [ ] Contact form fields are all visible
- [ ] Footer displays correctly
- [ ] Site looks good on mobile (use DevTools device emulation)
- [ ] All links work (no 404 errors)

---

## Additional Commands

### Build for Production
```bash
npm run build
```
Creates optimized files in the `dist/` directory for deployment.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing before deployment.

### Run Linter
```bash
npm run lint
```
Checks code for errors and style issues.

---

## File Structure Reference

```
premier-tech-solution/
├── src/                    # Your website code
│   ├── components/         # Reusable parts (Navbar, Footer, etc.)
│   ├── pages/             # Page components (Home, Services, etc.)
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── public/                # Static files (images, favicon)
├── node_modules/          # Installed packages (don't edit)
├── package.json           # Project configuration
└── vite.config.js         # Build tool configuration
```

---

## Need More Help?

### Documentation:
- Vite: https://vitejs.dev
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com

### In This Project:
- `README.md` - General project information
- `DEPLOYMENT.md` - How to deploy to production
- `CONTENT-UPDATE-GUIDE.md` - How to update website content
- `QUICK-START.md` - Quick reference guide

---

## Summary

**To start the server:**
1. Open terminal
2. Navigate to project: `cd [project-path]`
3. Install dependencies (first time): `npm install`
4. Start server: `npm run dev`
5. Open http://localhost:5173/ in browser

**To stop the server:**
- Press `Ctrl + C` in terminal

**That's it!** You're ready to test and develop the website locally. 🚀

---

**Last Updated:** September 29, 2026  
**Questions?** Check the troubleshooting section above or search online for "Vite dev server [your issue]"
