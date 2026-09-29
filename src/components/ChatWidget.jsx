import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../config/contact'

// Static FAQ data
const faqs = [
  {
    id: 1,
    question: "What services do you offer?",
    answer: "We offer HVAC services including heating systems (furnace installation, repair, and replacement), cooling systems (AC installation, repair, and replacement), heat pump systems, and indoor air quality solutions (air purification, filtration, and ventilation)."
  },
  {
    id: 2,
    question: "What is your service area?",
    answer: "Please use our contact form with your address, and we'll confirm whether we service your specific location."
  },
  {
    id: 3,
    question: "What are your business hours?",
    answer: "For our current business hours, please send us a message through the contact form and we'll respond with our schedule."
  },
  {
    id: 4,
    question: "How can I schedule service?",
    answer: "You can schedule service by filling out the contact form on our website. We'll get back to you promptly to confirm your appointment."
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer: "Please contact us for information about payment methods and available options."
  }
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-warm-500 to-cool-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all focus-visible-ring z-50"
        aria-label={isOpen ? 'Close FAQ' : 'Open FAQ'}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          )}
        </svg>
      </button>

      {/* FAQ Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl flex flex-col z-50 h-[32rem] max-h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-warm-500 to-cool-500 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
            <p className="text-sm text-white/90">Find answers to common questions</p>
          </div>

          {/* Search Box */}
          <div className="p-4 border-b">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cool-500"
            />
          </div>

          {/* FAQ List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-900 pr-2">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                          expandedId === faq.id ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedId === faq.id && (
                      <div className="px-4 py-3 bg-white text-gray-700 text-sm accordion-content">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No matching questions found.
                </p>
                <div className="bg-cool-50 border border-cool-200 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 mb-2">
                    Still have questions?
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    We're here to help! Contact us directly:
                  </p>
                  <div className="space-y-2">
                    {CONTACT_INFO.PHONE_TEL && (
                      <a
                        href={`tel:${CONTACT_INFO.PHONE_TEL}`}
                        className="block px-4 py-2 bg-warm-500 text-white rounded-lg hover:bg-warm-600 transition-colors text-center"
                      >
                        Call {CONTACT_INFO.PHONE_DISPLAY}
                      </a>
                    )}
                    <Link
                      to="/contact"
                      className="block px-4 py-2 bg-cool-500 text-white rounded-lg hover:bg-cool-600 transition-colors text-center"
                    >
                      Use Contact Form
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-600 text-center">
              Can't find what you're looking for?{' '}
              <a href="/contact" className="text-cool-600 hover:text-cool-700 font-medium">
                Contact us
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
