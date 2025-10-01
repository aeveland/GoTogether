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
  const { apiCall } = useAuth()
  const [showCreateList, setShowCreateList] = useState(false)
  const [newListData, setNewListData] = useState({ title: '', description: '' })
  const [creatingList, setCreatingList] = useState(false)

  const typeNames = {
    shopping: 'Shopping',
    todo: 'TODO',
    info: 'Info'
  }

  const handleCreateList = async (e) => {
    e.preventDefault()
    if (!newListData.title) return

    setCreatingList(true)
    try {
      const response = await apiCall(`/api/trips/${tripId}/lists`, {
        method: 'POST',
        body: JSON.stringify({
          title: newListData.title,
          description: newListData.description,
          type: type.toUpperCase()
        })
      })

      if (response.ok) {
        setNewListData({ title: '', description: '' })
        setShowCreateList(false)
        onListsChange()
      }
    } catch (error) {
      console.error('Failed to create list:', error)
    } finally {
      setCreatingList(false)
    }
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
        <button 
          onClick={() => setShowCreateList(true)}
          className="btn-primary"
        >
          + Create List
        </button>
      </div>

      {/* Create List Form */}
      {showCreateList && (
        <div className="card mb-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Create New {typeNames[type]} List</h3>
          <form onSubmit={handleCreateList} className="space-y-4">
            <input
              type="text"
              placeholder="List title"
              className="input"
              value={newListData.title}
              onChange={(e) => setNewListData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              placeholder="Description (optional)"
              className="input resize-none"
              rows={3}
              value={newListData.description}
              onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={creatingList}
                className="btn-primary disabled:opacity-50"
              >
                {creatingList ? 'Creating...' : 'Create List'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateList(false)
                  setNewListData({ title: '', description: '' })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
          <button 
            onClick={() => setShowCreateList(true)}
            className="btn-primary"
          >
            Create {typeNames[type]} List
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {lists.map((list) => (
            <ListCard 
              key={list.id} 
              list={list} 
              tripId={tripId}
              onListsChange={onListsChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ListCard({ list, tripId, onListsChange }) {
  const { apiCall } = useAuth()
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItemData, setNewItemData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: ''
  })
  const [addingItem, setAddingItem] = useState(false)

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItemData.title) return

    setAddingItem(true)
    try {
      const response = await apiCall(`/api/trips/${tripId}/lists/${list.id}/items`, {
        method: 'POST',
        body: JSON.stringify({
          title: newItemData.title,
          description: newItemData.description || null,
          priority: newItemData.priority,
          dueDate: newItemData.dueDate || null
        })
      })

      if (response.ok) {
        setNewItemData({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
        setShowAddItem(false)
        onListsChange()
      }
    } catch (error) {
      console.error('Failed to add item:', error)
    } finally {
      setAddingItem(false)
    }
  }

  const handleToggleItem = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    
    try {
      const response = await apiCall(`/api/trips/${tripId}/lists/${list.id}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        onListsChange()
      }
    } catch (error) {
      console.error('Failed to toggle item:', error)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.MEDIUM
  }

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': '⏳',
      'IN_PROGRESS': '🔄',
      'COMPLETED': '✅'
    }
    return icons[status] || icons.PENDING
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{list.title}</h3>
          {list.description && (
            <p className="text-gray-600 text-sm mb-3">{list.description}</p>
          )}
        </div>
        <button
          onClick={() => setShowAddItem(true)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          + Add Item
        </button>
      </div>

      {/* Add Item Form */}
      {showAddItem && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Add New Item</h4>
          <form onSubmit={handleAddItem} className="space-y-3">
            <input
              type="text"
              placeholder="Item title"
              className="input"
              value={newItemData.title}
              onChange={(e) => setNewItemData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              placeholder="Description (optional)"
              className="input resize-none"
              rows={2}
              value={newItemData.description}
              onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex space-x-3">
              <select
                className="input flex-1"
                value={newItemData.priority}
                onChange={(e) => setNewItemData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent</option>
              </select>
              <input
                type="datetime-local"
                className="input flex-1"
                value={newItemData.dueDate}
                onChange={(e) => setNewItemData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={addingItem}
                className="btn-primary disabled:opacity-50"
              >
                {addingItem ? 'Adding...' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddItem(false)
                  setNewItemData({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {list.items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items in this list yet</p>
        ) : (
          list.items.map((item) => (
            <div
              key={item.id}
              className={`p-3 border rounded-lg ${
                item.status === 'COMPLETED' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span
                      className={`${
                        item.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'
                      } font-medium`}
                    >
                      {item.title}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  )}
                  {item.assignedTo && (
                    <p className="text-gray-500 text-xs">Assigned to: {item.assignedTo.name}</p>
                  )}
                  {item.dueDate && (
                    <p className="text-gray-500 text-xs">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(item.status)}</span>
                  <button
                    onClick={() => handleToggleItem(item.id, item.status)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {item.status === 'COMPLETED' ? 'Undo' : 'Complete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
