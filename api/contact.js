// Serverless function for contact form submission
// This function sends emails using a service like SendGrid, Resend, or similar
// Environment variables needed: EMAIL_API_KEY, TO_EMAIL

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, phone, message } = req.body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Email service configuration required
    // Options: SendGrid, Resend, Postmark, AWS SES, etc.
    // Set EMAIL_API_KEY and TO_EMAIL environment variables
    // 
    // Example with Resend:
    // const resend = new Resend(process.env.EMAIL_API_KEY)
    // await resend.emails.send({
    //   from: 'noreply@premiertechsolution.com',
    //   to: process.env.TO_EMAIL,
    //   subject: `New Contact Form Submission from ${name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // })

    // For now, log to console (replace with actual email service)
    console.log('Contact form submission:', { name, email, phone, message })

    // Simulate email sending
    if (!process.env.EMAIL_API_KEY) {
      console.warn('WARNING: EMAIL_API_KEY not configured. Email not sent.')
      // In development, still return success
      return res.status(200).json({ 
        success: true, 
        message: 'Message received (email service not configured)' 
      })
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
