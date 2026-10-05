# Vercel Deployment Setup

This guide explains how to configure environment variables and deploy the contact form on Vercel.

## Prerequisites

- Vercel account connected to your repository
- Supabase project with `leads` table created (see `db/supabase-schema.sql`)

## Step 1: Configure Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add the following:

### Required Variables

| Variable Name | Value | Example | Notes |
|--------------|-------|---------|-------|
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` | Found in Supabase → Settings → API → Project URL |
| `SUPABASE_SECRET_KEY` | Your Supabase secret key | `sb_secret_xxxxx...` | The secret key starting with `sb_secret_` (NOT the anon key) |

### Optional Variables

| Variable Name | Value | Example | Notes |
|--------------|-------|---------|-------|
| `IP_HASH_SALT` | Random string for IP hashing | `random-salt-xyz123` | Used for rate limiting. Defaults to 'default-salt-change-in-production' |
| `MAIL_TO` | Email to receive notifications | `info@yourcompany.com` | Contact form submissions will be sent here |
| `MAIL_FROM` | Email from address | `noreply@yourcompany.com` | Sender address for notifications |

### How to Add Variables

1. Go to https://vercel.com/dashboard
2. Select your project (e.g., "hvac")
3. Click **Settings** → **Environment Variables**
4. For each variable:
   - Enter the **Key** (e.g., `SUPABASE_URL`)
   - Enter the **Value** (paste your actual value)
   - Select environments: **Production**, **Preview**, and **Development**
   - Click **Save**

## Step 2: Find Your Supabase Credentials

### SUPABASE_URL
1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Settings** (gear icon) → **API**
4. Copy the **Project URL** (e.g., `https://tzacswnbztavzvigezjy.supabase.co`)

### SUPABASE_SECRET_KEY
1. In the same **Settings → API** page
2. Find the **Project API keys** section
3. Copy the **service_role key** (starts with `sb_secret_` or `eyJ`)
   - ⚠️ **Important**: Use the `service_role` key, NOT the `anon` key
   - The `service_role` key bypasses Row Level Security (RLS) which is required for the contact form

## Step 3: Deploy

After adding environment variables:

1. **Automatic deployment**: Push to your repository
   ```bash
   git add .
   git commit -m "Configure contact form"
   git push
   ```

2. **Manual deployment**: 
   ```bash
   npx vercel --prod
   ```

3. Vercel will automatically redeploy with the new environment variables

## Step 4: Test the Contact Form

1. Visit your deployed site: `https://your-site.vercel.app/contact`
2. Fill out and submit the contact form
3. Check Supabase:
   - Go to **Table Editor** → **leads**
   - Verify new row appears with your submission
4. Check Vercel logs:
   - Go to **Deployments** → Click latest deployment → **Functions** tab
   - Click `api/contact.js` to see logs

## Troubleshooting

### Error: "Please call us" (503 error)

**Cause**: Missing or invalid environment variables

**Solution**:
1. Verify all required variables are set in Vercel dashboard
2. Check that `SUPABASE_URL` matches the format: `https://xxxxx.supabase.co`
3. Check that `SUPABASE_SECRET_KEY` starts with `sb_secret_` or `eyJ`
4. Redeploy after adding variables

### Error: "Too many submissions" (429 error)

**Cause**: Rate limit exceeded (5 submissions per IP per hour)

**Solution**:
- Wait 1 hour before testing again
- Or test from a different network/device
- Or temporarily increase limit in `api/contact.js` (line 107)

### Error: Nothing appears in Supabase

**Cause 1**: Wrong API key (using `anon` instead of `service_role`)

**Solution**: Double-check you're using the **service_role** key from Supabase → Settings → API

**Cause 2**: Network/firewall blocking Vercel → Supabase connection

**Solution**: Check Vercel function logs for error messages

### How to View Logs

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click on the latest deployment
4. Click **Functions** tab
5. Click `api/contact.js`
6. View real-time logs of submissions

## Email Notifications (Optional)

The Vercel serverless function currently **does not send emails** because Vercel doesn't have a built-in `mail()` function like PHP.

### To Enable Email Notifications:

**Option 1: Use Resend (Recommended)**
```bash
npm install resend
```

Update `api/contact.js` to use Resend API (see [Resend documentation](https://resend.com/docs/send-with-nodejs))

**Option 2: Use SendGrid**
```bash
npm install @sendgrid/mail
```

Update `api/contact.js` to use SendGrid API

**Option 3: Use Supabase Edge Functions**

Create a Supabase Edge Function that triggers on new row insertion and sends emails

### Current Behavior
- ✅ Leads are saved to Supabase
- ✅ Rate limiting works
- ❌ Email notifications are logged but not sent
- 💡 You can view new leads in Supabase dashboard

## Differences from GreenGeeks Deployment

| Feature | GreenGeeks (PHP) | Vercel (Node.js) |
|---------|------------------|------------------|
| Contact API | `/api/contact.php` | `/api/contact.js` |
| Configuration | `private_config/premier_tech_config.php` | Vercel Environment Variables |
| Email sending | PHP `mail()` function | Requires third-party service |
| Database | Supabase REST API | Supabase REST API |
| Rate limiting | ✅ Yes | ✅ Yes |
| IP hashing | ✅ Yes | ✅ Yes |

## Security Notes

- All environment variables are encrypted in Vercel
- Never commit `.env` files with real credentials to git
- The `service_role` key bypasses RLS - only use it server-side
- IP addresses are hashed before storage (GDPR compliant)
- Rate limiting prevents spam (5 submissions per IP per hour)
- Honeypot field catches basic bots

## Next Steps

1. ✅ Add environment variables in Vercel dashboard
2. ✅ Deploy or push to trigger rebuild
3. ✅ Test contact form submission
4. ✅ Verify data appears in Supabase
5. ⚠️ Optional: Configure email service (Resend/SendGrid)
6. ✅ Monitor Vercel function logs for errors

---

**Need Help?**
- Check Vercel function logs for detailed error messages
- Verify Supabase table schema matches `db/supabase-schema.sql`
- Ensure RLS is disabled on `leads` table OR use `service_role` key
