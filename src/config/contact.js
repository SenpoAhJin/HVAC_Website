/**
 * Business Contact Information Configuration
 * 
 * ⚠️ IMPORTANT: These are PLACEHOLDER values that MUST be replaced with real business information
 * before going live. The current phone number (+1234567890) is NOT REAL.
 * 
 * TO UPDATE:
 * 1. Replace PHONE_DISPLAY with your business phone number (formatted for display)
 * 2. Replace PHONE_TEL with the same number in tel: link format (digits only with country code)
 * 3. Replace EMAIL with your business email address
 * 4. Replace ADDRESS with your business address (or service area description)
 * 5. Replace HOURS with your actual business hours
 */

export const CONTACT_INFO = {
  // ⚠️ PLACEHOLDER - Replace with real phone number
  PHONE_DISPLAY: '(123) 456-7890',
  PHONE_TEL: '+1234567890',
  
  // ⚠️ PLACEHOLDER - Replace with real email
  EMAIL: 'info@premiertechsolution.com',
  
  // ⚠️ PLACEHOLDER - Replace with real address or service area
  ADDRESS: '[Service area to be specified]',
  
  // ⚠️ PLACEHOLDER - Replace with real business hours
  HOURS: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Emergency service only',
  
  // Social media links (optional - set to null if not available)
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
