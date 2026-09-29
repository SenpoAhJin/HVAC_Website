import { useState } from 'react'
import { CONTACT_INFO } from '../config/contact'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '' // Honeypot field
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus({
        type: 'success',
        message: data.message || 'Thank you for your message. We will be in touch soon.'
      })
      setFormData({ name: '', email: '', phone: '', message: '', website: '' })
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again later or use another contact method below.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    CONTACT_INFO.PHONE_DISPLAY && {
      icon: '📞',
      label: 'Phone',
      value: CONTACT_INFO.PHONE_DISPLAY,
      link: `tel:${CONTACT_INFO.PHONE_TEL}`
    },
    CONTACT_INFO.EMAIL && {
      icon: '✉️',
      label: 'Email',
      value: CONTACT_INFO.EMAIL,
      link: `mailto:${CONTACT_INFO.EMAIL}`
    },
    CONTACT_INFO.ADDRESS && {
      icon: '📍',
      label: 'Service Area',
      value: CONTACT_INFO.ADDRESS,
      link: null
    },
    CONTACT_INFO.HOURS && {
      icon: '🕐',
      label: 'Business Hours',
      value: CONTACT_INFO.HOURS,
      link: null
    }
  ].filter(Boolean) // Remove null/undefined entries

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-warm-600 to-cool-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto">
            Get in touch to schedule service
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Have a question about our services? Need HVAC service? We're here to help. Reach out to us using any of the methods below.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-warm-100 to-cool-100 rounded-lg flex items-center justify-center text-2xl">
                      {info.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {info.label}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-lg text-gray-900 hover:text-warm-600 transition-colors focus-visible-ring rounded"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-lg text-gray-900">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {status.message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-500 focus:border-transparent resize-none"
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                {/* Honeypot field - hidden from users, filled by bots */}
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-warm-500 to-cool-500 text-white font-bold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cool-500 focus-visible:ring-offset-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
