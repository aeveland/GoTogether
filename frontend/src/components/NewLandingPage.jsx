import { useState } from 'react'
import LoginForm from './LoginForm'

export default function NewLandingPage() {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with RV Background */}
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(/RVHero.jpeg)'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Plan Amazing Trips
            <br />
            <span className="text-blue-400">Together</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 font-light">
            Collaborate with friends and family to plan unforgettable adventures
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg w-full md:w-auto"
            >
              Start Planning Free
            </button>
            <button className="bg-transparent hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-lg text-lg w-full md:w-auto border-2 border-white transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Simple Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Everything You Need for Perfect Trips
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collaborative Lists</h3>
              <p className="text-gray-600">
                Create shopping lists, todo items, and info notes. Everyone can contribute in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Task Management</h3>
              <p className="text-gray-600">
                Assign tasks to team members, set priorities, and track completion.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Group Coordination</h3>
              <p className="text-gray-600">
                Invite friends and family. Everyone gets their own dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who trust GoTogether.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-lg"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  )
}
