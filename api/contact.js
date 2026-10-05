/**
 * Vercel Serverless Function - Contact Form API
 * Stores leads in Supabase and sends email notifications
 */

import crypto from 'crypto';

// Environment variables (set in Vercel dashboard)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const IP_HASH_SALT = process.env.IP_HASH_SALT || 'default-salt-change-in-production';
const MAIL_TO = process.env.MAIL_TO || '';
const MAIL_FROM = process.env.MAIL_FROM || 'noreply@vercel.app';

// Constants
const MAX_BODY_SIZE = 512000; // 512KB

function getSupabaseHeaders(secretKey) {
  return {
    'apikey': secretKey,
    'Authorization': `Bearer ${secretKey}`,
    'Content-Type': 'application/json'
  };
}

export default async function handler(req, res) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Type', 'application/json');

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Check config
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error('[contact.js] Missing Supabase configuration');
    return res.status(503).json({ ok: false, error: 'unavailable' });
  }

  try {
    // Parse and validate body
    const { name, email, phone, message, website } = req.body || {};

    // Honeypot check
    if (website && website.trim() !== '') {
      console.log('[contact.js] Honeypot triggered');
      return res.status(400).json({ ok: false, error: 'Invalid submission' });
    }

    // Validate required fields
    const nameClean = (name || '').trim().slice(0, 100);
    const emailClean = (email || '').trim().slice(0, 254);
    const phoneClean = phone ? (phone || '').trim().slice(0, 30) : null;
    const messageClean = (message || '').trim().slice(0, 5000);

    const errors = [];

    // Name: 1-100 characters
    if (nameClean.length < 1 || nameClean.length > 100) {
      errors.push('Name must be between 1 and 100 characters');
    }

    // Email: valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailClean.length < 3 || emailClean.length > 254 || !emailRegex.test(emailClean)) {
      errors.push('Valid email required (max 254 characters)');
    }

    // Phone: optional, max 30 characters
    if (phoneClean && phoneClean.length > 30) {
      errors.push('Phone must be 30 characters or less');
    }

    // Message: 1-5000 characters
    if (messageClean.length < 1 || messageClean.length > 5000) {
      errors.push('Message must be between 1 and 5000 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({ ok: false, error: errors.join('. ') });
    }

    // Compute ip_hash
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                     req.headers['x-real-ip'] || 
                     req.connection?.remoteAddress || 
                     'unknown';
    const ipHash = crypto.createHash('sha256').update(IP_HASH_SALT + clientIp).digest('hex');

    // User agent
    const userAgent = (req.headers['user-agent'] || '').slice(0, 300);

    // Rate limit: 5 leads per ip_hash per hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const rateLimitUrl = `${SUPABASE_URL}/rest/v1/leads?select=id&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(oneHourAgo)}`;

    try {
      const rateLimitResponse = await fetch(rateLimitUrl, {
        method: 'GET',
        headers: getSupabaseHeaders(SUPABASE_SECRET_KEY)
      });

      if (rateLimitResponse.ok) {
        const recentLeads = await rateLimitResponse.json();
        if (Array.isArray(recentLeads) && recentLeads.length >= 5) {
          return res.status(429).json({ 
            ok: false, 
            error: 'Too many submissions. Please try again later.' 
          });
        }
      } else {
        console.error('[contact.js] Rate limit check failed:', rateLimitResponse.status);
      }
    } catch (rateLimitError) {
      console.error('[contact.js] Rate limit check error:', rateLimitError.message);
      // Continue even if rate limit check fails
    }

    // Save lead to Supabase
    const leadData = {
      name: nameClean,
      email: emailClean,
      phone: phoneClean,
      message: messageClean,
      ip_hash: ipHash,
      user_agent: userAgent,
      status: 'new'
    };

    let leadSaved = false;
    try {
      const insertUrl = `${SUPABASE_URL}/rest/v1/leads`;
      const insertResponse = await fetch(insertUrl, {
        method: 'POST',
        headers: {
          ...getSupabaseHeaders(SUPABASE_SECRET_KEY),
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(leadData)
      });

      if (insertResponse.ok || insertResponse.status === 201) {
        leadSaved = true;
      } else {
        const errorText = await insertResponse.text();
        console.error('[contact.js] Failed to save lead:', insertResponse.status, errorText);
      }
    } catch (insertError) {
      console.error('[contact.js] Lead save error:', insertError.message);
    }

    // Email notification (if configured)
    let emailSent = false;
    if (MAIL_TO) {
      try {
        // Using a simple email service or Vercel's email integration
        // For now, we'll just log it since Vercel doesn't have built-in mail()
        console.log('[contact.js] Email would be sent to:', MAIL_TO);
        console.log('[contact.js] Lead details:', { name: nameClean, email: emailClean, phone: phoneClean });
        // In production, you'd integrate with SendGrid, Resend, or another email service
        emailSent = false; // Set to false since we're not actually sending
      } catch (emailError) {
        console.error('[contact.js] Email error:', emailError.message);
      }
    }

    // Return success if lead was saved OR email was sent
    if (leadSaved || emailSent) {
      return res.status(200).json({ 
        ok: true, 
        message: 'Thank you for contacting us. We will respond soon.' 
      });
    } else {
      return res.status(503).json({ ok: false, error: 'unavailable' });
    }

  } catch (error) {
    console.error('[contact.js] Unexpected error:', error);
    return res.status(503).json({ ok: false, error: 'unavailable' });
  }
}
