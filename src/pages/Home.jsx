import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../config/contact'
import PhoneCallButton from '../components/PhoneCallButton'

export default function Home() {
  const services = [
    {
      title: 'Heating',
      description: 'Furnace installation, repair, and replacement to keep your home warm and comfortable.',
      icon: '🔥',
      color: 'warm'
    },
    {
      title: 'Cooling',
      description: 'Air conditioning installation, repair, and replacement for efficient cooling.',
      icon: '❄️',
      color: 'cool'
    },
    {
      title: 'Heat Pumps',
      description: 'Energy-efficient heating and cooling solutions for year-round comfort.',
      icon: '♻️',
      color: 'warm'
    },
    {
      title: 'Indoor Air Quality',
      description: 'Air purification, filtration, and ventilation systems for healthier indoor air.',
      icon: '🌿',
      color: 'cool'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Diagonal Warm/Cool Seam */}
      <section className="relative overflow-hidden h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero/team-at-work.jpg`}
            alt="Premier Tech Solution HVAC installation team working on-site"
            className="w-full h-full object-cover opacity-20"
            loading="eager"
          />
        </div>

        {/* Diagonal Split Background Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-warm-500/90 via-warm-600/90 to-warm-700/90" 
               style={{ clipPath: 'polygon(0 0, 100% 0, 55% 100%, 0% 100%)' }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-bl from-cool-500/90 via-cool-600/90 to-cool-700/90"
               style={{ clipPath: 'polygon(55% 100%, 100% 0, 100% 100%)' }}>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight md:whitespace-nowrap">
              Comfort in Every Season
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/95 max-w-2xl">
              Expert heating and cooling solutions for your home
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <PhoneCallButton className="inline-block px-8 py-4 bg-white text-warm-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-warm-600">
                Contact Us Today
              </PhoneCallButton>
              <Link to="/services" className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cool-600">
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive HVAC solutions for every need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 card-hover"
              >
                <div className={`text-5xl mb-4 ${service.color === 'warm' ? 'text-warm-500' : 'text-cool-500'}`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              See All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Premier Tech Solution?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-warm-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Response</h3>
              <p className="text-gray-600">
                Quick, reliable service when you need it most
              </p>
            </div>

            <div className="text-center">
              <div className="bg-cool-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skilled Service</h3>
              <p className="text-gray-600">
                Trained technicians for all HVAC services
              </p>
            </div>

            <div className="text-center">
              <div className="bg-warm-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Service</h3>
              <p className="text-gray-600">
                We stand behind our work with quality service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-warm-600 to-cool-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/95">
            Contact us today for your HVAC needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {CONTACT_INFO.PHONE_TEL ? (
              <a href={`tel:${CONTACT_INFO.PHONE_TEL}`} className="inline-block px-8 py-4 bg-white text-warm-600 font-bold rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-warm-600">
                Call {CONTACT_INFO.PHONE_DISPLAY}
              </a>
            ) : (
              <Link to="/contact" className="inline-block px-8 py-4 bg-white text-warm-600 font-bold rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-warm-600">
                Contact Us
              </Link>
            )}
            <Link to="/contact" className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cool-600">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
