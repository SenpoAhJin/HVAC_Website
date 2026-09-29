import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../config/contact'

export default function About() {
  const values = [
    {
      title: 'Quality Workmanship',
      description: 'Every installation and repair meets the highest industry standards',
      icon: '🔧'
    },
    {
      title: 'Customer First',
      description: 'Your comfort and satisfaction are our top priorities',
      icon: '🤝'
    },
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees, clear estimates before we begin',
      icon: '💰'
    },
    {
      title: 'Ongoing Training',
      description: 'Our technicians stay current with the latest HVAC technology',
      icon: '📚'
    }
  ]

  const whyChooseUs = [
    'Heating system services',
    'Cooling system services',
    'Heat pump systems',
    'Indoor air quality solutions',
    'System maintenance',
    'Repair services'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-warm-600 to-cool-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">About Premier Tech Solution</h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto">
            Your trusted partner for residential HVAC services
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Approach</h2>

            <p className="text-gray-600 mb-6">
              Premier Tech Solution provides professional residential HVAC services with a focus on quality and customer satisfaction. We specialize in heating systems, cooling systems, heat pumps, and indoor air quality solutions.
            </p>

            <p className="text-gray-600 mb-6">
              Our team is dedicated to delivering reliable service for all your HVAC needs, from routine maintenance and repairs to complete system installations. We work efficiently to ensure your home's comfort systems operate at their best.
            </p>

            <p className="text-gray-600">
              We believe in transparent communication, honest recommendations, and workmanship that stands the test of time. Every project receives careful attention to detail and professional execution.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center card-hover"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="flex items-start">
                <svg
                  className="w-6 h-6 text-cool-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Team in Action</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our technicians are the heart of our business. Each team member brings training and a commitment to quality service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg card-hover">
              <img
                src={`${import.meta.env.BASE_URL}images/about/technician-1.jpg`}
                alt="HVAC technician performing professional air handler service"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">Professional Service</h3>
                <p className="text-sm text-gray-600">Our technicians bring expertise to every job</p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg card-hover">
              <img
                src={`${import.meta.env.BASE_URL}images/about/service-van.jpg`}
                alt="Fully stocked HVAC service van with organized professional tools"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">Fully Equipped</h3>
                <p className="text-sm text-gray-600">We arrive prepared for any job</p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg card-hover">
              <img
                src={`${import.meta.env.BASE_URL}images/about/technician-2.jpg`}
                alt="Expert HVAC technician providing quality equipment maintenance"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900">Quality Workmanship</h3>
                <p className="text-sm text-gray-600">Attention to detail in every repair</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-warm-600 to-cool-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experience the Premier Tech Difference
          </h2>
          <p className="text-xl mb-8 text-white/95">
            Contact us today to learn more about our services
          </p>
          {CONTACT_INFO.PHONE_TEL ? (
            <a
              href={`tel:${CONTACT_INFO.PHONE_TEL}`}
              className="inline-block px-8 py-4 bg-white text-warm-600 font-bold rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-warm-600"
            >
              Call {CONTACT_INFO.PHONE_DISPLAY}
            </a>
          ) : (
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-warm-600 font-bold rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-warm-600"
            >
              Contact Us
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
