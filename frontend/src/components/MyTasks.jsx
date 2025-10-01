import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function MyTasks() {
  const { apiCall } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const response = await apiCall('/api/my-tasks')
      const data = await response.json()
      
      if (response.ok) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (tripId, listId, itemId) => {
    try {
      const response = await apiCall(`/api/trips/${tripId}/lists/${listId}/items/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'COMPLETED' })
      })

      if (response.ok) {
        loadTasks() // Refresh tasks
      }
    } catch (error) {
      console.error('Failed to complete task:', error)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        <p className="text-gray-600">Tasks assigned to you across all trips</p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
          <p className="text-gray-600">Tasks assigned to you will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => handleCompleteTask(task.list.trip.id, task.listId, task.id)}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, onComplete, getPriorityColor }) {
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Trip:</span> {task.list.trip.title}</p>
            <p><span className="font-medium">List:</span> {task.list.title} ({task.list.type})</p>
            {task.description && (
              <p><span className="font-medium">Description:</span> {task.description}</p>
            )}
            {dueDate && (
              <p><span className="font-medium">Due:</span> {dueDate}</p>
            )}
          </div>
        </div>

        <button
          onClick={onComplete}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          Complete
        </button>
      </div>
    </div>
  )
}
