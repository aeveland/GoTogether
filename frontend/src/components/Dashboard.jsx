import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import TripList from './TripList'
import TripDetails from './TripDetails'
import MyTasks from './MyTasks'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('trips')
  const [selectedTrip, setSelectedTrip] = useState(null)

  const tabs = [
    { id: 'trips', name: 'My Trips', icon: '🗺️' },
    { id: 'tasks', name: 'My Tasks', icon: '✅' },
  ]

  const handleTripSelect = (trip) => {
    setSelectedTrip(trip)
    setActiveTab('trip-details')
  }

  const handleBackToTrips = () => {
    setSelectedTrip(null)
    setActiveTab('trips')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg mr-3">
                <span className="text-white text-lg">🚀</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">GoTogether</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}!</span>
              <button
                onClick={logout}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      {activeTab !== 'trip-details' && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'trips' && (
          <TripList onTripSelect={handleTripSelect} />
        )}
        
        {activeTab === 'tasks' && (
          <MyTasks />
        )}
        
        {activeTab === 'trip-details' && selectedTrip && (
          <TripDetails 
            trip={selectedTrip} 
            onBack={handleBackToTrips}
          />
        )}
      </main>
    </div>
  )
}
