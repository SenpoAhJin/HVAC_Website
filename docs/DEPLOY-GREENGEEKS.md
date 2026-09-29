# GreenGeeks Deployment Guide

Complete step-by-step instructions for deploying Premier Tech Solution to GreenGeeks shared hosting.

## Prerequisites

- GreenGeeks hosting account with cPanel access
- Database access (MySQL)
- Email account for SMTP notifications
- Domain name configured and pointing to GreenGeeks

## Phase 1: Database Setup

### 1.1 Create Database

1. Login to **cPanel**
2. Navigate to **MySQL® Databases**
3. Under "Create New Database":
   - Database Name: `hvac` (full name will be `username_hvac`)
   - Click **Create Database**

### 1.2 Create Database User

1. Scroll to "MySQL Users" → "Add New User"
2. Username: `hvacuser` (full name will be `username_hvacuser`)
3. Generate a strong password (use Password Generator)
4. **Save this password securely** - you'll need it for configuration
5. Click **Create User**

### 1.3 Grant Privileges

1. Scroll to "Add User To Database"
2. Select the user (`username_hvacuser`)
3. Select the database (`username_hvac`)
4. Click **Add**
5. On the next screen, check **ALL PRIVILEGES**
6. Click **Make Changes**

### 1.4 Import Schema

1. Navigate to **phpMyAdmin** in cPanel
2. Select your database (`username_hvac`) from the left sidebar
3. Click the **Import** tab
4. Click **Choose File** and select `db/schema.sql` from your project
5. Ensure format is set to **SQL**
6. Click **Go**
7. Verify success message and check that two tables exist:
   - `leads`
   - `rate_limits`

## Phase 2: Email Configuration

### 2.1 Create Email Account

1. In cPanel, navigate to **Email Accounts**
2. Click **Create**
3. Email: `noreply@yourdomain.com` (or your preferred address)
4. Generate a strong password
5. **Save this password securely**
6. Set mailbox quota (2048 MB is usually sufficient)
7. Click **Create**

### 2.2 SMTP Settings

Your SMTP settings will be:
- **Host**: `mail.yourdomain.com`
- **Port**: `587` (TLS) or `465` (SSL)
- **Username**: `noreply@yourdomain.com` (full email address)
- **Password**: The password you just created

## Phase 3: Configuration File

### 3.1 Create Private Directory

Using cPanel **File Manager**:

1. Navigate to your home directory (`/home/username/`)
2. Click **+ Folder** and create `private/`
3. This folder is ABOVE `public_html/` and not web-accessible

### 3.2 Create Config File

1. In the `private/` folder, create a new file: `hvac-config.php`
2. Copy the contents from `api/config.sample.php`
3. Edit with your real values:

```php
<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'username_hvac');              // Replace username_
define('DB_USER', 'username_hvacuser');          // Replace username_
define('DB_PASS', 'your_database_password_here');

// SMTP Configuration
define('SMTP_HOST', 'mail.yourdomain.com');      // Replace yourdomain.com
define('SMTP_PORT', 587);
define('SMTP_USER', 'noreply@yourdomain.com');   // Replace yourdomain.com
define('SMTP_PASS', 'your_email_password_here');

// Email Addresses
define('MAIL_TO', 'contact@yourdomain.com');     // Where to send notifications
define('MAIL_FROM', 'noreply@yourdomain.com');   // Must match SMTP_USER

// Site Configuration
define('SITE_URL', 'https://yourdomain.com');    // Your actual domain
?>
```

4. **Save the file**

### 3.3 Set Permissions

In File Manager:
1. Right-click `hvac-config.php` → **Permissions**
2. Set to **600** (owner read/write only)
3. Click **Change Permissions**

## Phase 4: Upload Files

### 4.1 Build Deployment Package

On your local machine:

```bash
npm run build:deploy
```

This creates a `deploy/` folder with all necessary files.

### 4.2 Upload to Server

Using cPanel **File Manager** or FTP:

1. Navigate to `public_html/`
2. **Delete any default files** (index.html, cgi-bin, etc.)
3. Upload ALL contents from the `deploy/` folder:
   - All files in deploy/ root (index.html, assets/, etc.)
   - api/ folder
   - .htaccess file

4. Preserve the folder structure

**Alternative using FTP:**
- Use FileZilla or any FTP client
- Connect using credentials from cPanel
- Upload to `/public_html/`

### 4.3 Verify File Structure

Your `public_html/` should look like:
```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── index-abc123.js
│   ├── index-xyz789.css
│   └── ...
├── api/
│   ├── contact.php
│   ├── .htaccess
│   ├── config.sample.php
│   └── vendor/
│       └── PHPMailer/
└── images/ (if any)
```

### 4.4 Set API Permissions

In File Manager:
1. Navigate to `public_html/api/`
2. Right-click `contact.php` → **Permissions**
3. Set to **755** (rwxr-xr-x)
4. Verify `.htaccess` is **644**

## Phase 5: Testing

### 5.1 Basic Site Test

1. Visit `https://yourdomain.com`
2. Should load the homepage
3. Click through all nav links (Home, Services, About, Contact)

### 5.2 SPA Routing Test

1. Visit `https://yourdomain.com/services` directly (type in browser)
2. Should load Services page (not 404)
3. Press F5 to refresh
4. Should stay on Services page
5. Repeat for `/about` and `/contact`

✅ If you see 404 errors, check that `.htaccess` was uploaded correctly

### 5.3 Contact Form Test

1. Visit `https://yourdomain.com/contact`
2. Fill out the form with test data:
   - Use a real email you can check
   - Fill all required fields
3. Click **Send Message**
4. Should see success message

### 5.4 Database Verification

1. Go to **phpMyAdmin** in cPanel
2. Select your database
3. Click on the `leads` table
4. Click **Browse**
5. Should see your test submission
6. Verify `email_sent` is `1`

### 5.5 Email Notification Test

1. Check the inbox for `MAIL_TO` address
2. Should receive an email notification with:
   - Subject: "New Contact Form Submission - Premier Tech Solution"
   - Body contains form data
   - Reply-To is the visitor's email

### 5.6 Security Tests

**Test 1: Honeypot (Bot Protection)**
1. Open browser developer tools
2. Go to Contact page
3. In Console, type:
   ```javascript
   document.getElementById('website').value = 'spam';
   ```
4. Submit form
5. Should appear to succeed (200 OK) but NOT save to database
6. Check phpMyAdmin - no new lead should be added

**Test 2: Rate Limiting**
1. Submit contact form successfully
2. Immediately submit 5 more times rapidly
3. After 5 submissions, should get "Too many requests" error
4. Wait 10 minutes before testing again

**Test 3: Config File Protection**
1. Try to access `https://yourdomain.com/api/config.php`
2. Should get **403 Forbidden**
3. Try `https://yourdomain.com/api/config.sample.php`
4. Should also get **403 Forbidden**

## Phase 6: Monitoring

### 6.1 Check Error Logs

In cPanel:
1. Navigate to **Errors**
2. Check for PHP errors related to `contact.php`
3. Common issues:
   - Database connection failures → Check DB credentials
   - Email send failures → Check SMTP credentials
   - Permission errors → Check file permissions

### 6.2 Monitor Leads

Check phpMyAdmin regularly:
- Review new entries in `leads` table
- Monitor `email_sent` column (should be 1)
- If `email_sent` is 0, check SMTP configuration

## Troubleshooting

### Problem: 404 on page refresh

**Cause**: `.htaccess` not uploaded or Apache mod_rewrite disabled

**Solution**:
1. Verify `.htaccess` exists in `public_html/`
2. Contact GreenGeeks support to enable `mod_rewrite` (usually enabled by default)

### Problem: Contact form shows "Service temporarily unavailable"

**Cause**: Configuration file not found or database connection failed

**Solution**:
1. Verify `/home/username/private/hvac-config.php` exists
2. Check database credentials in config
3. Test database connection in phpMyAdmin

### Problem: Form submits but no email received

**Cause**: SMTP configuration incorrect

**Solution**:
1. Check SMTP credentials in config file
2. Verify email account exists in cPanel
3. Check that `MAIL_FROM` matches `SMTP_USER`
4. Check spam folder for test emails
5. Review error logs for SMTP errors

### Problem: "Too many requests" on first submission

**Cause**: Rate limit table has stale entries

**Solution**:
1. Go to phpMyAdmin
2. Select `rate_limits` table
3. Click **Empty** to clear old entries
4. Try submitting again

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
5. Force HTTPS by uncommenting lines in `.htaccess`:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ```

## Maintenance

### Regular Tasks

1. **Monitor leads**: Check phpMyAdmin weekly for new submissions
2. **Clear rate limits**: Monthly, empty `rate_limits` table
3. **Backup database**: Use phpMyAdmin Export feature monthly
4. **Update dependencies**: Periodically check for PHPMailer updates

### Security Recommendations

1. Change database password every 90 days
2. Use strong, unique passwords for all accounts
3. Keep backup of configuration file in secure location (not in git!)
4. Monitor error logs for suspicious activity
5. Keep GreenGeeks hosting and PHP version updated

## Support

- **GreenGeeks Support**: Available 24/7 via cPanel ticket system
- **PHP Errors**: Check cPanel → Errors
- **Email Issues**: Check cPanel → Email Deliverability
- **Database Issues**: Use phpMyAdmin error messages

---

**Deployment Complete!** Your site is now live on GreenGeeks shared hosting with PHP/MySQL backend.
