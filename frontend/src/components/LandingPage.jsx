import { useState } from 'react'
import LoginForm from './LoginForm'

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <span className="text-xl font-bold text-white">GT</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">GoTogether</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAuth(true)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuth(true)}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/RVHero.jpeg)',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Plan Amazing Trips
              <span className="block text-white drop-shadow-2xl">
                Together - UPDATED!
              </span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto drop-shadow-xl font-medium">
              Collaborate with friends and family to plan unforgettable adventures. 
              Share lists, assign tasks, and stay organized from planning to packing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAuth(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
              >
                Start Planning Free
              </button>
              <button className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 border-2 border-white hover:bg-white hover:bg-opacity-100 font-bold py-4 px-8 rounded-lg text-lg transition-all shadow-xl">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect Trips
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              From initial planning to final packing, GoTogether keeps your group organized and excited.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
              <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Collaborative Lists</h3>
              <p className="text-gray-700">
                Create shopping lists, todo items, and info notes. Everyone can contribute and stay updated in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200">
              <div className="bg-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Task Management</h3>
              <p className="text-gray-700">
                Assign tasks to team members, set priorities, and track completion. Never forget important trip preparations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-gray-200">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Group Coordination</h3>
              <p className="text-gray-700">
                Invite friends and family to your trips. Everyone gets their own dashboard to see their assigned tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple. Organized. Collaborative.
            </h2>
            <p className="text-xl text-gray-700">
              Get started in minutes and transform how your group plans trips.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Trip</h3>
              <p className="text-gray-700">Set up your trip details and invite your travel companions to join.</p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Together</h3>
              <p className="text-gray-700">Create lists, assign tasks, and collaborate on all trip preparations.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoy Your Adventure</h3>
              <p className="text-gray-700">Everything organized, nothing forgotten. Focus on making memories!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of travelers who trust GoTogether to organize their perfect trips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowAuth(true)}
              className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Get Started Free
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg text-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <span className="text-xl font-bold text-white">GT</span>
              </div>
              <span className="ml-3 text-xl font-bold">GoTogether</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 GoTogether. Built for collaborative trip planning.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
