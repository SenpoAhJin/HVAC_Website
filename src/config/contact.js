/**
 * Business Contact Information Configuration
 * 
 * TO UPDATE: Replace empty strings with real business information.
 * Components will hide elements when values are empty.
 */

export const CONTACT_INFO = {
  // Business phone number (formatted for display, e.g., "(555) 123-4567")
  PHONE_DISPLAY: '',
  // Phone number for tel: links (digits only with country code, e.g., "+15551234567")
  PHONE_TEL: '',
  
  // Business email address
  EMAIL: '',
  
  // Business address or service area description
  ADDRESS: '',
  
  // Business hours (use \n for line breaks)
  HOURS: '',
  
  // Production domain (e.g., "premiertechsolution.com")
  // Used for canonical URLs, sitemap, and robots.txt
  DOMAIN: '',
  
  // Social media links (set to null if not available)
  FACEBOOK: null,
  INSTAGRAM: null,
  LINKEDIN: null,
}

// Helper function to check if we're on mobile/touch device
export const isMobileDevice = () => {
  // Check for touch capability and small screen
  return (
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    window.matchMedia('(max-width: 768px)').matches
  )
}
