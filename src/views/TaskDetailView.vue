<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p class="mt-4 text-gray-500">Loading task details...</p>
        </div>
  
        <div v-else-if="error" class="text-center py-12">
          <div class="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Task not found</h3>
          <p class="mt-2 text-gray-500">{{ error }}</p>
          <div class="mt-6">
            <router-link
              to="/tasks"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowLeftIcon class="h-4 w-4 mr-2" />
              Back to Tasks
            </router-link>
          </div>
        </div>
  
        <div v-else-if="task">
          <div class="mb-6">
            <nav class="flex" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-4">
                <li>
                  <router-link to="/tasks" class="text-gray-400 hover:text-gray-500">
                    <ClipboardDocumentListIcon class="h-5 w-5" />
                    <span class="sr-only">Tasks</span>
                  </router-link>
                </li>
                <li>
                  <div class="flex items-center">
                    <ChevronRightIcon class="h-5 w-5 text-gray-400" />
                    <router-link
                      to="/tasks"
                      class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      All Tasks
                    </router-link>
                  </div>
                </li>
                <li>
                  <div class="flex items-center">
                    <ChevronRightIcon class="h-5 w-5 text-gray-400" />
                    <span class="ml-4 text-sm font-medium text-gray-900 truncate max-w-xs">
                      {{ task.title }}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
  
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <h1 class="text-2xl font-bold text-gray-900">{{ task.title }}</h1>
                  <span 
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getTaskStatusClass(task)"
                  >
                    {{ getTaskStatus(task) }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editTask"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon class="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    @click="deleteTask"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon class="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
  
            <div class="px-6 py-6">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Description</h3>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <p v-if="task.description" class="text-gray-700 whitespace-pre-wrap">
                        {{ task.description }}
                      </p>
                      <p v-else class="text-gray-400 italic">
                        No description provided
                      </p>
                    </div>
                  </div>
  
                
                </div>
  
                <div class="space-y-6">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Task Information</h3>
                    <dl class="space-y-3">
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Due Date</dt>
                        <dd class="mt-1 text-sm text-gray-900 flex items-center">
                          <CalendarDaysIcon class="h-4 w-4 mr-2 text-gray-400" />
                          {{ formatDateTime(task.due_date) }}
                          <span v-if="isOverdue(task)" class="ml-2 text-red-600 text-xs font-medium">
                            (Overdue)
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Created</dt>
                        <dd class="mt-1 text-sm text-gray-900 flex items-center">
                          <ClockIcon class="h-4 w-4 mr-2 text-gray-400" />
                          {{ formatDateTime(task.created_at) }}
                        </dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd class="mt-1 text-sm text-gray-900 flex items-center">
                          <ClockIcon class="h-4 w-4 mr-2 text-gray-400" />
                          {{ formatDateTime(task.updated_at) }}
                        </dd>
                      </div>
                      <div v-if="task.completed_at">
                        <dt class="text-sm font-medium text-gray-500">Completed</dt>
                        <dd class="mt-1 text-sm text-gray-900 flex items-center">
                          <CheckCircleIcon class="h-4 w-4 mr-2 text-green-500" />
                          {{ formatDateTime(task.completed_at) }}
                        </dd>
                      </div>
                    </dl>
                  </div>
  
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div class="space-y-3">
                      <button
                        v-if="!task.is_completed"
                        @click="markAsComplete"
                        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircleIcon class="h-4 w-4 mr-2" />
                        Mark as Complete
                      </button>
                   
                  
                    </div>
                  </div>
  
                  <!-- Time Tracking -->
                  <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Time Tracking</h3>
                    <div class="space-y-3">
                      <div>
                        <span class="text-sm text-gray-500">Time until due:</span>
                        <p class="text-lg font-medium" :class="getTimeUntilDueClass(task)">
                          {{ getTimeUntilDue(task) }}
                        </p>
                      </div>
                      <div>
                        <span class="text-sm text-gray-500">Days since created:</span>
                        <p class="text-lg font-medium text-gray-900">
                          {{ getDaysSinceCreated(task) }} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <TaskModal
        :show="showEditModal"
        :task="task"
        @close="showEditModal = false"
        @saved="handleTaskSaved"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useTaskStore } from '@/stores/taskStore'
  import { taskService } from '@/services/taskService'
  import { useEventBus } from '@/composables/useEventBus'
  import TaskModal from '@/components/TaskModal.vue'

  import {
    ClipboardDocumentListIcon,
    ChevronRightIcon,
    PencilIcon,
    TrashIcon,
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentDuplicateIcon,
    ExclamationTriangleIcon,
    ArrowLeftIcon,
    PlusCircleIcon,
    MinusCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const route = useRoute()
  const router = useRouter()
  const taskStore = useTaskStore()
  const { emit } = useEventBus()
  const task = ref(null)
const error = ref(null)
const showEditModal = ref(false)
  const { loading } = taskStore

  
  onMounted(async () => {
    await fetchTask()
  })
  
  async function fetchTask() {
  try {
    const taskId = route.params.id
    const response = await taskService.getTask(taskId)
    task.value = response.data
    error.value = null
  } catch (err) {
    task.value = null
    error.value = err.response?.data?.message || 'An unexpected error occurred.'
    if (err.response?.status === 404 || err.response?.status === 403) {
      emit('notification:show', {
        type: 'error',
        title: 'Error',
        message: error.value
      })
    }
  }
}

  
  function formatDateTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  function getTaskStatus(task) {
    const now = new Date()
    const dueDate = new Date(task.due_date)
    
    if (task.completed_at) return 'Completed'
    if (dueDate < now) return 'Overdue'
    if (dueDate.toDateString() === now.toDateString()) return 'Due Today'
    return 'Upcoming'
  }
  
  function getTaskStatusClass(task) {
    const status = getTaskStatus(task)
    
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      case 'Due Today':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }
  
  function isOverdue(task) {
    return !task.completed_at && new Date(task.due_date) < new Date()
  }
  
  function getTimeUntilDue(task) {
    const now = new Date()
    const dueDate = new Date(task.due_date)
    const diffMs = dueDate - now
    
    if (diffMs < 0) {
      const overdueDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24))
      return `${overdueDays} days overdue`
    }
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) {
      return `${days} days, ${hours} hours`
    } else if (hours > 0) {
      return `${hours} hours`
    } else {
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      return `${minutes} minutes`
    }
  }
  
  function getTimeUntilDueClass(task) {
    if (isOverdue(task)) return 'text-red-600'
    
    const now = new Date()
    const dueDate = new Date(task.due_date)
    const diffMs = dueDate - now
    const hours = diffMs / (1000 * 60 * 60)
    
    if (hours < 24) return 'text-yellow-600'
    if (hours < 72) return 'text-orange-600'
    return 'text-green-600'
  }
  
  function getDaysSinceCreated(task) {
    const now = new Date()
    const createdDate = new Date(task.created_at)
    const diffMs = now - createdDate
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
  }
  
  function getActivityIcon(type) {
    switch (type) {
      case 'created':
        return PlusCircleIcon
      case 'updated':
        return PencilIcon
      case 'completed':
        return CheckCircleIcon
      case 'deleted':
        return MinusCircleIcon
      default:
        return ClockIcon
    }
  }
  
  function getActivityIconClass(type) {
    switch (type) {
      case 'created':
        return 'bg-green-500 text-white'
      case 'updated':
        return 'bg-blue-500 text-white'
      case 'completed':
        return 'bg-green-500 text-white'
      case 'deleted':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }
  
  function editTask() {
    showEditModal.value = true
  }
  
  async function deleteTask() {
    if (confirm(`Are you sure you want to delete "${task.value.title}"?`)) {
      try {
        await taskService.deleteTask(task.value.id)
        
        emit('notification:show', {
          type: 'success',
          title: 'Task Deleted',
          message: 'Task has been deleted successfully.'
        })
        
        router.push('/tasks')
      } catch (error) {
        emit('notification:show', {
          type: 'error',
          title: 'Error',
          message: 'Failed to delete task. Please try again.'
        })
      }
    }
  }
  
  async function markAsComplete() {
    try {
      await taskService.updateTask(task.value.id, { is_completed: true, completed_at: new Date().toISOString() })
      task.value.completed_at = new Date().toISOString()
      
      emit('notification:show', {
        type: 'success',
        title: 'Task Completed',
        message: 'Task has been marked as complete.'
      })
    } catch (error) {
      emit('notification:show', {
        type: 'error',
        title: 'Error',
        message: 'Failed to update task. Please try again.'
      })
    }
  }
  
 

  function handleTaskSaved() {
    showEditModal.value = false
    fetchTask() 
    emit('notification:show', {
      type: 'success',
      title: 'Task Updated',
      message: 'Task has been updated successfully.'
    })
  }
  </script>
  
