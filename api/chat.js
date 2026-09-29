// Serverless function for AI chatbot
// Uses OpenAI API with custom knowledge base
// Environment variable needed: OPENAI_API_KEY

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, history } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.warn('WARNING: OPENAI_API_KEY not configured')
      return res.status(200).json({
        message: 'I\'m currently being configured. Please call us at (123) 456-7890 or use the contact form, and we\'ll be happy to help!'
      })
    }

    // Load knowledge base from environment or file
    // The business owner will provide documentation that gets loaded here
    const knowledgeBase = process.env.CHATBOT_KNOWLEDGE || `
You are a helpful customer service assistant for Premier Tech Solution, a residential HVAC company.

IMPORTANT: Only answer questions using the information provided in this knowledge base. If you don't know the answer or the information isn't in your knowledge base, politely direct the customer to call (123) 456-7890 or use the contact form.

KNOWLEDGE BASE:
[To be provided by business owner - this should include:]
- Service area coverage
- Pricing approach (e.g., "We provide free estimates")
- Services offered (heating, cooling, heat pumps, indoor air quality)
- Scheduling policy
- Emergency service availability
- Common FAQs
- What makes the company unique

Do not make up information. Do not provide generic HVAC advice. Only use information from this knowledge base.
    `.trim()

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: knowledgeBase
      }
    ]

    // Add conversation history (limit to last 10 messages to control token usage)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10)
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const data = await response.json()
    const assistantMessage = data.choices[0].message.content

    return res.status(200).json({ message: assistantMessage })

  } catch (error) {
    console.error('Chat error:', error)
    return res.status(500).json({ 
      message: 'I\'m having trouble responding right now. Please call us at (123) 456-7890 or use the contact form for assistance.' 
    })
  }
}
