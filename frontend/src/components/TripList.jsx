import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import CreateTripModal from './CreateTripModal'

export default function TripList({ onTripSelect }) {
  const { apiCall } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    try {
      const response = await apiCall('/api/trips')
      const data = await response.json()
      
      if (response.ok) {
        setTrips(data.trips)
      }
    } catch (error) {
      console.error('Failed to load trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTripCreated = (newTrip) => {
    setTrips(prev => [newTrip, ...prev])
    setShowCreateModal(false)
  }

  const handleDeleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return

    try {
      const response = await apiCall(`/api/trips/${tripId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTrips(prev => prev.filter(trip => trip.id !== tripId))
      }
    } catch (error) {
      console.error('Failed to delete trip:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Trips</h2>
          <p className="text-gray-600">Plan and organize your adventures</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <span className="mr-2">+</span>
          Create Trip
        </button>
      </div>

      {/* Trip Grid */}
      {trips.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-6">Create your first trip to get started!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onSelect={() => onTripSelect(trip)}
              onDelete={() => handleDeleteTrip(trip.id)}
            />
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      {showCreateModal && (
        <CreateTripModal
          onClose={() => setShowCreateModal(false)}
          onTripCreated={handleTripCreated}
        />
      )}
    </div>
  )
}

function TripCard({ trip, onSelect, onDelete }) {
  const { user } = useAuth()
  const startDate = new Date(trip.startDate).toLocaleDateString()
  const endDate = new Date(trip.endDate).toLocaleDateString()
  const isCreator = trip.createdById === user?.id

  return (
    <div className="card hover:shadow-md transition-shadow cursor-pointer group">
      <div onClick={onSelect}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {trip.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">👥</span>
            {trip.participants.length}
          </div>
        </div>

        {trip.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {trip.description}
          </p>
        )}

        {trip.location && (
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <span className="mr-2">📍</span>
            {trip.location}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="mr-2">📅</span>
          {startDate} - {endDate}
        </div>

        <div className="text-xs text-gray-500">
          Created by {trip.createdBy.name}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={onSelect}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Open Trip →
        </button>
        
        {isCreator && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
