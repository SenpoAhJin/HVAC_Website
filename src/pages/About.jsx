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
    'Licensed and insured professionals',
    'Years of industry experience',
    'Prompt, reliable service',
    'Competitive pricing',
    'Quality parts and materials',
    'Satisfaction guaranteed',
    'Emergency service available',
    'Free estimates on installations'
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
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <p className="text-gray-700 italic">
                <strong>Note:</strong> This section contains placeholder content. The business owner will provide the actual company story, including founding year, background, mission, and what makes Premier Tech Solution unique.
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              Premier Tech Solution was founded with a simple mission: to provide homeowners with reliable, professional HVAC services they can trust. We understand that your home's heating and cooling systems are essential to your comfort and well-being.
            </p>

            <p className="text-gray-600 mb-6">
              What started as a small operation has grown into a full-service HVAC company serving [service area to be specified]. Our growth is built on a foundation of quality work, honest service, and genuine care for our customers.
            </p>

            <p className="text-gray-600">
              Today, we're proud to be a locally-owned business that treats every customer like family. Whether it's a routine maintenance call or an emergency repair, we bring the same level of professionalism and attention to detail to every job.
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
                className="bg-white p-6 rounded-lg shadow-md text-center"
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

      {/* Team Section Placeholder */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our certified technicians are the heart of our business. Each team member brings expertise, professionalism, and a commitment to your satisfaction.
          </p>

          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-warm-500 to-cool-500 rounded-full flex items-center justify-center text-white text-2xl">
                  📸
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Team Photos Coming Soon</h3>
                <p className="text-gray-600">
                  The business owner will provide photos of the team members for this section. Photos should be placed in the Image_Assets folder under the appropriate category.
                </p>
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
          <a
            href="tel:+1234567890"
            className="inline-block px-8 py-4 bg-white text-warm-600 font-bold rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-warm-600"
          >
            Call (123) 456-7890
          </a>
        </div>
      </section>
    </div>
  )
}
