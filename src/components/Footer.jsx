import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../config/contact'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-warm-400">Premier</span>
              <span className="text-2xl font-bold text-cool-400 ml-1">Tech</span>
            </div>
            <p className="text-sm">
              Professional HVAC services for your home comfort needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-warm-400 transition-colors focus-visible-ring rounded">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-warm-400 transition-colors focus-visible-ring rounded">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-warm-400 transition-colors focus-visible-ring rounded">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-warm-400 transition-colors focus-visible-ring rounded">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Heating Installation & Repair</li>
              <li>Cooling Installation & Repair</li>
              <li>Heat Pumps</li>
              <li>Indoor Air Quality</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${CONTACT_INFO.PHONE_TEL}`} className="hover:text-warm-400 transition-colors focus-visible-ring rounded">
                  Phone: {CONTACT_INFO.PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_INFO.EMAIL}`} className="hover:text-warm-400 transition-colors focus-visible-ring rounded">
                  {CONTACT_INFO.EMAIL}
                </a>
              </li>
              <li className="text-gray-400">
                Service Area: {CONTACT_INFO.ADDRESS}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {currentYear} Premier Tech Solution. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
