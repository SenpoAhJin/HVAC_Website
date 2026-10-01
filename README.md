# Premier Tech Solution Website

A modern, responsive marketing website for Premier Tech Solution, a residential HVAC company. Built with React, Vite, and Tailwind CSS, designed for GreenGeeks shared hosting with PHP backend and Supabase database.

## Features

- ✨ Modern, sleek design with custom warm/cool color scheme
- 📱 Fully responsive (mobile, tablet, desktop)
- ♿ Accessible (keyboard navigation, focus states, reduced motion support)
- 📧 Contact form with PHP backend and Supabase storage
- 🎨 Custom diagonal warm/cool hero section
- 🔒 Security features: rate limiting, input validation

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM (SPA)
- **Backend:** PHP 7.4+
- **Database:** Supabase (PostgreSQL via REST API)
- **Hosting:** GreenGeeks Shared Hosting (Apache, cPanel)

## Project Structure

```
premier-tech-solution/
├── src/
│   ├── components/     # Reusable components (Navbar, Footer, ChatWidget)
│   ├── pages/          # Page components (Home, Services, About, Contact)
│   ├── config/         # Configuration (contact, site)
│   ├── App.jsx         # Main app with routing
│   └── main.jsx        # Entry point
├── api/                # PHP backend
│   ├── contact.php     # Contact form API endpoint
│   ├── keepalive.php   # Supabase connection check (cron)
│   ├── config.sample.php  # Sample configuration
│   └── .htaccess       # API security rules
├── db/                 # Database
│   └── supabase-schema.sql  # Database schema
├── public/             # Static assets
│   └── .htaccess       # Apache SPA routing
├── docs/               # Documentation
│   └── DEPLOY-GREENGEEKS.md  # Full deployment guide
└── scripts/            # Build tools
    ├── check-placeholders.js  # Placeholder guard
    └── build-deploy.js        # Deployment packager
```

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173

**Note:** Contact form won't work locally without backend setup.

## Database

This site uses Supabase (PostgreSQL) to store contact form submissions and track rate limiting.

### Schema

- **leads**: Contact form submissions
  - `id`, `created_at`, `name`, `email`, `phone`, `message`, `ip_hash`, `email_sent`
- **rate_limits**: Rate limiting tracker
  - `id`, `ip_hash`, `created_at`

### Setup

See `db/README.md` and `docs/DEPLOY-GREENGEEKS.md` for complete database setup instructions.

## Configuration

### Business Contact Information

Update `src/config/contact.js` with your real business information:

```javascript
export const CONTACT_INFO = {
  PHONE_DISPLAY: '(415) 555-0123',
  PHONE_TEL: '+14155550123',
  EMAIL: 'contact@yourdomain.com',
  ADDRESS: 'Your City, State',
  HOURS: 'Mon-Fri 8AM-6PM, Sat 9AM-2PM'
}
```

### Site Configuration

Update `src/config/site.js` or set environment variable:

```javascript
export const SITE_CONFIG = {
  SITE_URL: 'https://yourdomain.com',
  SITE_NAME: 'Premier Tech Solution',
  // ...
}
```

### Backend Configuration

**IMPORTANT**: Never commit real credentials to Git!

1. Create `/home/username/private_config/premier_tech_config.php` on server (above public_html)
2. Copy from `api/config.sample.php`
3. Fill in your Supabase URL, secret key, and email addresses

See `docs/DEPLOY-GREENGEEKS.md` for detailed instructions.

## Deployment

### Build for Production

```bash
npm run build:deploy
```

This creates a `deploy/` folder with everything needed for GreenGeeks.

### Upload to GreenGeeks

1. Build deployment package locally
2. Upload `deploy/` contents to `public_html/` via cPanel File Manager or FTP
3. Create Supabase project and run `db/supabase-schema.sql` in SQL Editor
4. Create configuration file in `/home/username/private/hvac-config.php`
5. Test the site

**Complete step-by-step guide**: See `docs/DEPLOY-GREENGEEKS.md`

## Development Commands

```bash
npm run dev                 # Start development server
npm run build               # Build for production
npm run build:deploy        # Build + create deployment package
npm run preview             # Preview production build
npm run lint                # Run ESLint
npm run check:placeholders  # Check for placeholder content
```

## Security Features

- **Rate Limiting**: 5 submissions per 10 minutes per IP
- **Honeypot**: Bot detection and silent rejection
- **Input Validation**: Server-side validation of all fields
- **Prepared Statements**: SQL injection protection
- **CSRF Protection**: Origin/Referer validation
- **IP Privacy**: Only SHA-256 hashes stored, never raw IPs
- **Config Protection**: `.htaccess` denies direct access to config files

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Accessibility

This site follows WCAG 2.1 Level AA guidelines:
- Keyboard navigable
- Screen reader friendly
- Visible focus indicators
- Respects prefers-reduced-motion
- Proper heading hierarchy
- Sufficient color contrast

## Placeholder Guard

A pre-build script checks for placeholder content and unverified claims. Build will fail if found.

Protected patterns include:
- Phone: Specific fake patterns
- Email: `example.com`, `test@`, placeholder domains
- Text: `Lorem ipsum`
- Claims: `licensed`, `insured`, `certified`, `free estimate`, etc.

Override only when absolutely necessary by editing `scripts/check-placeholders.js`.

## Troubleshooting

### Site shows 404 on page refresh

- Verify `.htaccess` is uploaded to `public_html/`
- Check that Apache `mod_rewrite` is enabled (usually is on GreenGeeks)

### Contact form not working

- Check database credentials in config file
- Verify database tables exist in Supabase Table Editor
- Check PHP error logs in cPanel → Errors

### No email notifications

- Verify email addresses in config file (MAIL_FROM and MAIL_TO)
- Check email account exists in cPanel → Email Accounts
- Check cPanel → Email Deliverability for SPF/DKIM issues
- Check spam folder

See `docs/DEPLOY-GREENGEEKS.md` for complete troubleshooting guide.

## Maintenance

- **Monitor leads**: Check Supabase dashboard weekly
- **Backup database**: Supabase automatic backups (Pro plan)
- **Clear rate limits**: Empty `rate_limits` table monthly
- **Review logs**: Check cPanel error logs regularly

## Documentation

- **Deployment**: `docs/DEPLOY-GREENGEEKS.md` - Complete deployment guide
- **Content Updates**: `docs/CONTENT-UPDATE-GUIDE.md` - Update guide
- **Launch Checklist**: `docs/LAUNCH-CHECKLIST.md` - Pre-launch tasks
- **Changelog**: `CHANGELOG.md` - Version history

## Support

For hosting issues:
- **GreenGeeks Support**: Available 24/7 via cPanel

For technical documentation:
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind: https://tailwindcss.com
- Supabase: https://supabase.com/docs

## License

Copyright © 2026 Premier Tech Solution. All rights reserved.
