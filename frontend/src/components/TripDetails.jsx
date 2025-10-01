import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function TripDetails({ trip, onBack }) {
  const { apiCall } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'shopping', name: 'Shopping', icon: '🛒' },
    { id: 'todo', name: 'TODO', icon: '✅' },
    { id: 'info', name: 'Info', icon: 'ℹ️' },
  ]

  useEffect(() => {
    if (activeTab !== 'overview') {
      loadLists()
    }
  }, [activeTab, trip.id])

  const loadLists = async () => {
    setLoading(true)
    try {
      const response = await apiCall(`/api/trips/${trip.id}/lists`)
      const data = await response.json()
      
      if (response.ok) {
        setLists(data.lists)
      }
    } catch (error) {
      console.error('Failed to load lists:', error)
    } finally {
      setLoading(false)
    }
  }

  const getListsForType = (type) => {
    return lists.filter(list => list.type === type.toUpperCase())
  }

  const startDate = new Date(trip.startDate).toLocaleDateString()
  const endDate = new Date(trip.endDate).toLocaleDateString()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-primary-600 hover:text-primary-700 font-medium mb-4 flex items-center"
        >
          ← Back to Trips
        </button>
        
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-xl">
          <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
          {trip.description && (
            <p className="opacity-90 mb-3">{trip.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            {trip.location && (
              <span>📍 {trip.location}</span>
            )}
            <span>📅 {startDate} - {endDate}</span>
            <span>👥 {trip.participants.length} participants</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <TripOverview trip={trip} onTabChange={setActiveTab} />
      )}

      {activeTab !== 'overview' && (
        <ListsView
          type={activeTab}
          lists={getListsForType(activeTab)}
          loading={loading}
          tripId={trip.id}
          onListsChange={loadLists}
        />
      )}
    </div>
  )
}

function TripOverview({ trip, onTabChange }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onTabChange('shopping')}
          className="card hover:shadow-md transition-shadow cursor-pointer text-center"
        >
          <div className="text-4xl mb-3">🛒</div>
          <h3 className="font-semibold text-gray-900">Shopping Lists</h3>
          <p className="text-gray-600 text-sm mt-2">Manage what to buy for your trip</p>
        </div>

        <div
          onClick={() => onTabChange('todo')}
          className="card hover:shadow-md transition-shadow cursor-pointer text-center"
        >
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-semibold text-gray-900">TODO Lists</h3>
          <p className="text-gray-600 text-sm mt-2">Track tasks and assignments</p>
        </div>

        <div
          onClick={() => onTabChange('info')}
          className="card hover:shadow-md transition-shadow cursor-pointer text-center"
        >
          <div className="text-4xl mb-3">ℹ️</div>
          <h3 className="font-semibold text-gray-900">Info Lists</h3>
          <p className="text-gray-600 text-sm mt-2">Share important information</p>
        </div>
      </div>
    </div>
  )
}

function ListsView({ type, lists, loading, tripId, onListsChange }) {
  const typeNames = {
    shopping: 'Shopping',
    todo: 'TODO',
    info: 'Info'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {typeNames[type]} Lists
        </h2>
        <button className="btn-primary">
          + Create List
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">
            {type === 'shopping' && '🛒'}
            {type === 'todo' && '✅'}
            {type === 'info' && 'ℹ️'}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {typeNames[type].toLowerCase()} lists yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first {typeNames[type].toLowerCase()} list to get started!
          </p>
          <button className="btn-primary">
            Create {typeNames[type]} List
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {lists.map((list) => (
            <div key={list.id} className="card">
              <h3 className="font-semibold text-gray-900 mb-2">{list.title}</h3>
              {list.description && (
                <p className="text-gray-600 text-sm mb-4">{list.description}</p>
              )}
              <div className="text-sm text-gray-500">
                {list.items.length} items
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
