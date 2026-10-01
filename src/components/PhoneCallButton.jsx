import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_INFO, isMobileDevice } from '../config/contact'

/**
 * PhoneCallButton Component
 * 
 * Mobile: Opens phone dialer directly
 * Desktop: Shows popover with phone number, copy button, and contact form link
 */
export default function PhoneCallButton({ className = '', children }) {
  const [showPopover, setShowPopover] = useState(false)
  const [copied, setCopied] = useState(false)

  // Don't render if no phone number configured
  if (!CONTACT_INFO.PHONE_TEL) {
    return null
  }

  const handleClick = (e) => {
    if (!isMobileDevice()) {
      e.preventDefault()
      setShowPopover(true)
    }
    // On mobile, let the tel: link work naturally
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.PHONE_DISPLAY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClose = () => {
    setShowPopover(false)
    setCopied(false)
  }

  return (
    <>
      <a
        href={`tel:${CONTACT_INFO.PHONE_TEL}`}
        onClick={handleClick}
        className={className}
      >
        {children || 'Call Now'}
      </a>

      {/* Desktop Popover */}
      {showPopover && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleClose}
          />

          {/* Popover */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl p-6 w-96 max-w-[calc(100vw-2rem)]">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cool-500 rounded"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600">Give us a call to discuss your HVAC needs</p>
              </div>

              {/* Phone number */}
              <div className="bg-gradient-to-br from-warm-50 to-cool-50 rounded-lg p-4 border border-warm-200">
                <p className="text-3xl font-bold text-center text-gray-900 tracking-wide">
                  {CONTACT_INFO.PHONE_DISPLAY}
                </p>
              </div>

              {/* Business hours */}
              {CONTACT_INFO.HOURS && (
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-900 mb-1">Business Hours:</p>
                  <p className="whitespace-pre-line">{CONTACT_INFO.HOURS}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleCopy}
                  className="w-full px-4 py-3 bg-cool-500 text-white font-semibold rounded-lg hover:bg-cool-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cool-500 focus-visible:ring-offset-2"
                >
                  {copied ? '✓ Copied!' : 'Copy Number'}
                </button>

                <Link
                  to="/contact"
                  onClick={handleClose}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cool-500 focus-visible:ring-offset-2"
                >
                  Request Estimate Online
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
