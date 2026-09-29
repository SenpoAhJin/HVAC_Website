export default function Services() {
  const services = [
    {
      title: 'Heating',
      image: `${import.meta.env.BASE_URL}images/services/heating-service.jpg`,
      color: 'warm',
      description: 'Keep your home warm and comfortable all winter long with our comprehensive heating services.',
      offerings: [
        'Furnace Installation',
        'Furnace Repair',
        'Furnace Replacement',
        'Furnace Maintenance',
        'Emergency Heating Repairs',
        'System Diagnostics'
      ]
    },
    {
      title: 'Cooling',
      image: `${import.meta.env.BASE_URL}images/services/cooling-service.jpg`,
      color: 'cool',
      description: 'Stay cool and comfortable during hot weather with our professional air conditioning services.',
      offerings: [
        'Air Conditioner Installation',
        'AC Repair & Troubleshooting',
        'AC Replacement',
        'Preventive Maintenance',
        'Emergency Cooling Service',
        'Energy Efficiency Upgrades'
      ]
    },
    {
      title: 'Heat Pumps',
      image: `${import.meta.env.BASE_URL}images/services/heat-pump-service.jpg`,
      color: 'warm',
      description: 'Energy-efficient heating and cooling in one system for year-round comfort and lower utility bills.',
      offerings: [
        'Heat Pump Installation',
        'Heat Pump Repair',
        'Heat Pump Replacement',
        'Dual Fuel Systems',
        'Ductless Mini-Split Systems',
        'Regular Maintenance Programs'
      ]
    },
    {
      title: 'Indoor Air Quality',
      image: `${import.meta.env.BASE_URL}images/services/air-quality-service.jpg`,
      color: 'cool',
      description: 'Breathe cleaner, healthier air with our advanced indoor air quality solutions.',
      offerings: [
        'Air Purification Systems',
        'Whole-Home Air Filtration',
        'UV Light Installation',
        'Humidity Control',
        'Ventilation System Upgrades',
        'Duct Cleaning'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-warm-600 to-cool-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-white/95 max-w-2xl mx-auto">
            Complete HVAC solutions for residential comfort and efficiency
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-center`}
              >
                {/* Image/Visual */}
                <div className="flex-shrink-0">
                  <div className="w-80 h-64 rounded-2xl overflow-hidden shadow-lg card-hover">
                    <img
                      src={service.image}
                      alt={`${service.title} - Professional HVAC service installation and repair`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2
                    className={`text-4xl font-bold mb-4 ${
                      service.color === 'warm' ? 'text-warm-600' : 'text-cool-600'
                    }`}
                  >
                    {service.title}
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">
                    {service.description}
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Included:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.offerings.map((offering, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className={`w-6 h-6 mr-2 mt-0.5 flex-shrink-0 ${
                            service.color === 'warm' ? 'text-warm-500' : 'text-cool-500'
                          }`}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{offering}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <a
                      href="tel:+1234567890"
                      className={`inline-block px-6 py-3 font-semibold rounded-lg transition-colors focus-visible-ring ${
                        service.color === 'warm'
                          ? 'bg-warm-500 text-white hover:bg-warm-600'
                          : 'bg-cool-500 text-white hover:bg-cool-600'
                      }`}
                    >
                      Get Free Estimate
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services Banner */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Emergency Service?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We're available 24/7 for urgent HVAC repairs
          </p>
          <a
            href="tel:+1234567890"
            className="inline-block px-8 py-4 bg-gradient-to-r from-warm-500 to-cool-500 text-white font-bold rounded-lg hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            Call Now: (123) 456-7890
          </a>
        </div>
      </section>
    </div>
  )
}
