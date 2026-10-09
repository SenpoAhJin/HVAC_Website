# GreenGeeks Deployment Guide

Complete step-by-step instructions for deploying Premier Tech Solution to GreenGeeks shared hosting.

## Prerequisites

- GreenGeeks hosting account with cPanel access
- Supabase account (free tier available)
- Email account on your domain for notifications
- Domain name configured and pointing to GreenGeeks

## Fill These In Before Launch

Before building and deploying, update your business information in `src/config/contact.js`:

```javascript
export const CONTACT_INFO = {
  PHONE_DISPLAY: '(415) 555-0123',  // Your formatted phone number
  PHONE_TEL: '+14155550123',         // Phone number for tel: links
  EMAIL: 'contact@yourdomain.com',   // Your business email
  ADDRESS: 'Your City, State',       // Service area
  HOURS: 'Mon-Fri 8AM-6PM',         // Business hours
  DOMAIN: 'yourdomain.com',          // Your production domain (no https://)
}
```

**Then rebuild:**
```bash
npm run build:greengeeks
```

This single command rebuilds with your updated information.

## Phase 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Name**: premier-tech-hvac (or your choice)
   - **Database Password**: Generate a strong password (you won't need this for the website)
   - **Region**: Choose closest to your customers
4. Click **Create new project**
5. Wait 2-3 minutes for project to be ready

### 1.2 Run Database Schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open `db/supabase-schema.sql` from your project folder on your computer
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Should see success message: "Success. No rows returned"

### 1.3 Confirm Row Level Security (RLS)

1. In Supabase, click **Table Editor** in the left sidebar
2. Select the `leads` table
3. Look for a shield icon or "RLS enabled" indicator
4. It should show **RLS is enabled**
5. If not, go back to SQL Editor and run:
   ```sql
   alter table public.leads enable row level security;
   ```

### 1.4 Get Secret API Key

1. In Supabase, click **Settings** (gear icon at bottom left)
2. Click **API** in the settings menu
3. Scroll to **Project API keys** section
4. Find the **secret key** (starts with `sb_secret_`, not the public anon key)
5. Click the **Copy** button to copy the key
6. **Save this key securely** - you'll need it for configuration

**Important Notes:**
- The secret key starts with `sb_secret_` followed by random characters
- Never commit this key to git
- Never share it publicly
- This key has elevated permissions, so keep it secret

## Phase 2: Email Configuration

### 2.1 Create Email Account

1. In cPanel, navigate to **Email Accounts**
2. Click **Create**
3. Email: `noreply@yourdomain.com` (or your preferred address)
4. Generate a strong password
5. **Save this password securely**
6. Set mailbox quota (2048 MB is usually sufficient)
7. Click **Create**

### 2.2 Check Email Deliverability

1. In cPanel, find **Email Deliverability**
2. Check your domain
3. Look for green checkmarks on SPF and DKIM
4. If issues are shown, click **Manage** and follow the repair steps
5. This helps ensure your emails don't go to spam

## Phase 3: Configuration File

### 3.1 Create Private Directory

Using cPanel **File Manager**:

1. Navigate to your home directory (`/home/username/`)
2. Click **+ Folder** and create `private_config/`
3. This folder is ABOVE `public_html/` and not web-accessible

### 3.2 Create Config File

1. In the `private_config/` folder, create a new file: `premier_tech_config.php`
2. Copy the contents from `api/config.sample.php` in your project
3. Edit with your real values:

```php
<?php
return [
  'supabase' => [
    'SUPABASE_URL' => 'https://xxxxxxxxxxxxx.supabase.co',
    'SUPABASE_SECRET_KEY' => 'PASTE_YOUR_SECRET_KEY_HERE',
  ],
  
  'email' => [
    'MAIL_TO' => 'info@yourdomain.com',
    'MAIL_FROM' => 'noreply@yourdomain.com',
  ],
  
  'security' => [
    'IP_HASH_SALT' => 'random_string_at_least_32_chars_long',
  ],
];
?>
```

**Where to find each value:**

- **SUPABASE_URL**: In Supabase → Settings → API → Project URL
- **SUPABASE_SECRET_KEY**: The secret key you created in step 1.4
- **MAIL_TO**: Your business email where you want to receive contact form notifications
- **MAIL_FROM**: The email account you created in step 2.1
- **IP_HASH_SALT**: Generate a random string (at least 32 characters). You can use: [random.org/strings](https://www.random.org/strings/)

4. **Save the file**

### 3.3 Set Permissions

In File Manager:
1. Right-click `premier_tech_config.php` → **Permissions**
2. Set to **600** (owner read/write only)
3. Click **Change Permissions**

## Phase 4: Upload Files

### 4.1 Build Deployment Package

On your local machine, set your production URL:

```bash
# Windows PowerShell
$env:VITE_SITE_URL="https://premiertechsolution.us"
npm run build:greengeeks

# Mac/Linux
export VITE_SITE_URL=https://premiertechsolution.us
npm run build:greengeeks
```

This creates a `deploy/` folder with all necessary files.

### 4.2 Upload to Server (ADDON DOMAIN)

**CRITICAL:** This site is deployed as an ADDON domain. The upload path is:

```
/home/studen29/public_html/premiertechsolution.us/
```

**NOT** `/public_html/` (which belongs to the main domain studentaidsupport.us).

Using cPanel **File Manager** or FTP:

1. Navigate to `/home/studen29/public_html/premiertechsolution.us/`
   - If this folder doesn't exist, you need to add the addon domain first in cPanel → Domains
2. **Delete any existing files in this folder** (old index.html, etc.)
3. Upload the **CONTENTS** of the `deploy/` folder:
   - All files from deploy/ root (index.html, assets/, images/, etc.)
   - api/ folder with all PHP files
   - .htaccess file (hidden file - enable "Show Hidden Files" in File Manager)
   - favicon.svg, icons.svg, robots.txt, sitemap.xml

4. **Do NOT upload the deploy/ folder itself** - upload its contents

**Alternative using FTP:**
- Use FileZilla or any FTP client
- Connect using credentials from cPanel
- Navigate to `/home/studen29/public_html/premiertechsolution.us/`
- Upload all contents from local `deploy/` folder

### 4.3 Verify File Structure

Your `/home/studen29/public_html/premiertechsolution.us/` should look like:
```
premiertechsolution.us/
├── index.html
├── .htaccess
├── assets/
│   ├── index-abc123.js
│   ├── index-xyz789.css
│   └── ...
├── api/
│   ├── contact.php
│   ├── keepalive.php
│   ├── .htaccess
│   └── config.sample.php
└── images/ (if any)
```

### 4.4 Set API Permissions

In File Manager:
1. Navigate to `public_html/api/`
2. Right-click `contact.php` → **Permissions**
3. Set to **755** (rwxr-xr-x)
4. Do the same for `keepalive.php`
5. Verify `.htaccess` is **644**

## Phase 5: Cron Job (Keep-Alive)

Supabase Free tier pauses your database after 7 days of inactivity. To prevent this, set up a cron job.

### 5.1 Add Cron Job

1. In cPanel, go to **Cron Jobs**
2. Under "Add New Cron Job":
   - **Common Settings**: Select "Twice Per Week (0 0 * * 0,4)"
   - Or set manually: `0 0 * * 0,4` (runs Sunday and Thursday at midnight)
3. **Command**: 
   ```
   /usr/bin/php /home/username/public_html/api/keepalive.php >> /home/username/logs/keepalive.log 2>&1
   ```
   Replace `username` with your actual cPanel username
4. Click **Add New Cron Job**

This runs every 2-3 days to keep your Supabase project active.

## Phase 6: Testing

### 6.1 Basic Site Test

1. Visit `https://yourdomain.com`
2. Should load the homepage
3. Click through all nav links (Home, Services, About, Contact)

### 6.2 SPA Routing Test

1. Visit `https://yourdomain.com/services` directly (type in browser)
2. Should load Services page (not 404)
3. Press F5 to refresh
4. Should stay on Services page
5. Repeat for `/about` and `/contact`

✅ If you see 404 errors, check that `.htaccess` was uploaded correctly

### 6.3 Contact Form Test

1. Visit `https://yourdomain.com/contact`
2. Fill out the form with test data:
   - Use a real email you can check
   - Fill all required fields
3. Click **Send Message**
4. Should see success message

### 6.4 Database Verification

1. Go to Supabase dashboard
2. Click **Table Editor**
3. Select the `leads` table
4. Should see your test submission
5. Check that all fields are filled correctly

### 6.5 Email Notification Test

1. Check the inbox for `MAIL_TO` address (from your config)
2. Should receive an email notification with:
   - Subject: "New Contact Form Submission from [Name]"
   - Body contains form data
   - Reply-To is the visitor's email

### 6.6 Delete Test Row

1. In Supabase Table Editor, find your test lead
2. Hover over the row
3. Click the trash icon
4. Confirm deletion
5. This keeps your database clean

## Phase 7: Ongoing Maintenance

### 7.1 Monitor Leads

- **Supabase Dashboard**: Click Table Editor → leads table to see new submissions
- Check weekly for new contact form submissions
- Update status column as you respond to leads (new → contacted → closed)

### 7.2 Supabase Plan Decision

**Free Tier:**
- Good for: Low-traffic sites (< 500MB database, < 5GB bandwidth/month)
- **Important**: Pauses after 7 days of no activity (cron job prevents this)
- Resumes instantly when accessed
- No credit card required

**Pro Tier ($25/month):**
- Never pauses
- Higher limits
- Daily backups
- Better support
- Recommended for production businesses

**When to upgrade**: When you get 10+ leads per month or want guaranteed uptime.

### 7.3 Secret Key Rotation

For security, rotate your Supabase secret key every 6-12 months:

1. In Supabase → Settings → API → API Key Management
2. Create a new service role key with a new name
3. Update your config file with the new key
4. Test the contact form
5. Delete the old key

### 7.4 Backup

Supabase Pro tier includes automatic daily backups. On Free tier:

1. Go to Supabase → Database → Backups
2. Click **Download Backup** monthly
3. Save the file securely

## Troubleshooting

### Problem: 404 on page refresh

**Cause**: `.htaccess` not uploaded or Apache mod_rewrite disabled

**Solution**:
1. Verify `.htaccess` exists in `public_html/`
2. Contact GreenGeeks support to enable `mod_rewrite` (usually enabled by default)

### Problem: Contact form shows "Service temporarily unavailable"

**Cause**: Configuration file not found or Supabase connection failed

**Solution**:
1. Verify `/home/username/private_config/premier_tech_config.php` exists
2. Check that SUPABASE_URL and SUPABASE_SECRET_KEY are correct
3. Test connection by visiting your Supabase dashboard
4. Check PHP error logs in cPanel

### Problem: Form submits but no email received

**Cause**: Email configuration incorrect

**Solution**:
1. Verify email account exists in cPanel
2. Check that `MAIL_FROM` matches an existing email on your domain
3. Check spam folder for test emails
4. Review cPanel → Email Deliverability for issues
5. Check PHP error logs for mail() errors

### Problem: "Too many requests" error

**Cause**: Submitted more than 5 forms in 1 hour from the same IP

**Solution**:
1. This is normal rate limiting behavior
2. Wait 1 hour before testing again
3. Or test from a different network/device

### Problem: Supabase database paused

**Cause**: Free tier pauses after 7 days of inactivity

**Solution**:
1. Visit your Supabase dashboard - it will resume automatically
2. Check that your cron job is running (cPanel → Cron Jobs)
3. Check cron logs: `/home/username/logs/keepalive.log`
4. Upgrade to Pro tier for no pauses

### Problem: Images not loading

**Cause**: Images may not have been uploaded

**Solution**:
1. Verify `assets/` folder was uploaded
2. Check browser console for 404 errors
3. Re-upload missing files

## Domain Configuration

If your domain isn't pointing to GreenGeeks yet:

1. Get your GreenGeeks nameservers from cPanel
2. Update DNS at your domain registrar:
   - Usually `ns1.greengeeks.com` and `ns2.greengeeks.com`
3. DNS propagation can take 24-48 hours
4. Use [whatsmydns.net](https://www.whatsmydns.net/) to check propagation

## SSL Certificate

GreenGeeks provides free Let's Encrypt SSL:

1. In cPanel, go to **SSL/TLS Status**
2. Find your domain
3. Click **Run AutoSSL**
4. Certificate should install automatically
5. Your site should now load with `https://`

## Support

- **GreenGeeks Support**: Available 24/7 via cPanel ticket system
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **PHP Errors**: Check cPanel → Errors
- **Email Issues**: Check cPanel → Email Deliverability

---

**Deployment Complete!** Your site is now live on GreenGeeks shared hosting with Supabase database backend.
