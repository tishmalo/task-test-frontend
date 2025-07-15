<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Tasks
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Manage and organize your tasks efficiently.
            </p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              New Task
            </button>
          </div>
        </div>
  
        <!-- Filters and Search -->
        <div class="mb-6 bg-white shadow rounded-lg p-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Search -->
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                placeholder="Search tasks..."
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
  
            <!-- Status Filter -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                v-model="selectedStatus"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Tasks</option>
                <option value="overdue">Overdue</option>
                <option value="today">Due Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
  
            <!-- Sort -->
            <div>
              <label for="sort" class="block text-sm font-medium text-gray-700">Sort By</label>
              <select
                id="sort"
                v-model="sortBy"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="due_date">Due Date</option>
                <option value="created_at">Created Date</option>
                <option value="title">Title</option>
              </select>
            </div>
  
            <!-- Sort Direction -->
            <div>
              <label for="direction" class="block text-sm font-medium text-gray-700">Order</label>
              <select
                id="direction"
                v-model="sortDirection"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Tasks List -->
        <div class="bg-white shadow rounded-lg">
          <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p class="mt-4 text-gray-500">Loading tasks...</p>
          </div>
  
          <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
            <ClipboardDocumentListIcon class="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p class="text-gray-500 mb-4">
              {{ searchQuery || selectedStatus !== 'all' ? 'No tasks match your current filters.' : 'Get started by creating your first task.' }}
            </p>
            <button
              v-if="!searchQuery && selectedStatus === 'all'"
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Create Task
            </button>
          </div>
  
          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="task in paginatedTasks"
              :key="task.id"
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <h3
                        class="text-lg font-medium text-indigo-600 hover:underline cursor-pointer"
                        @click="viewTask(task)"
                        >
                        {{ task.title }}
                        </h3>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getTaskStatusClass(task)"
                    >
                      {{ getTaskStatus(task) }}
                    </span>
                  </div>
                  <p v-if="task.description" class="mt-1 text-sm text-gray-500">
                    {{ task.description }}
                  </p>
                  <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <CalendarDaysIcon class="h-4 w-4 mr-1" />
                      Due: {{ formatDate(task.due_date) }}
                    </span>
                    <span class="flex items-center">
                      <ClockIcon class="h-4 w-4 mr-1" />
                      Created: {{ formatDate(task.created_at) }}
                    </span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click="editTask(task)"
                    class="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteTask(task)"
                    class="p-2 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Showing {{ (currentPage - 1) * tasksPerPage + 1 }} to {{ Math.min(currentPage * tasksPerPage, filteredTasks.length) }} of {{ filteredTasks.length }} results
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      @click="currentPage--"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="currentPage = page"
                      :class="[
                        page === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button
                      @click="currentPage++"
                      :disabled="currentPage === totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Task Modal -->
      <TaskModal
        :show="showCreateModal"
        :task="editingTask"
        @close="closeModal"
        @saved="handleTaskSaved"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useTaskStore } from '@/stores/taskStore'
  import { useEventBus } from '@/composables/useEventBus'
  import TaskModal from '@/components/TaskModal.vue'
  import {
    PlusIcon,
    ClipboardDocumentListIcon,
    CalendarDaysIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon
  } from '@heroicons/vue/24/outline'
  
  const route = useRoute()
  const router = useRouter()
  const taskStore = useTaskStore()
  const { emit } = useEventBus()
  
  const { tasks, loading, fetchTasks, deleteTask: removeTask } = taskStore
  
  const searchQuery = ref('')
  const selectedStatus = ref('all')
  const sortBy = ref('due_date')
  const sortDirection = ref('asc')
  const currentPage = ref(1)
  const tasksPerPage = 10
  
  const showCreateModal = ref(false)
  const editingTask = ref(null)
  
  onMounted(async () => {
    if (route.query.filter) {
      selectedStatus.value = route.query.filter
    }
    
    await fetchTasks()
  })
  
  const filteredTasks = computed(() => {
    let filtered = [...tasks]
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      )
    }
    
    if (selectedStatus.value !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.due_date)
        
        switch (selectedStatus.value) {
          case 'overdue':
            return !task.completed_at && dueDate < today
          case 'today':
            return !task.completed_at && dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
          case 'upcoming':
            return !task.completed_at && dueDate >= new Date(today.getTime() + 24 * 60 * 60 * 1000)
          case 'completed':
            return task.completed_at
          default:
            return true
        }
      })
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy.value]
      let bValue = b[sortBy.value]
      
      if (sortBy.value === 'due_date' || sortBy.value === 'created_at') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
    
    return filtered
  })
  
  const totalPages = computed(() => Math.ceil(filteredTasks.value.length / tasksPerPage))
  
  const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * tasksPerPage
    const end = start + tasksPerPage
    return filteredTasks.value.slice(start, end)
  })
  
  const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  })
  
  watch([searchQuery, selectedStatus, sortBy, sortDirection], () => {
    currentPage.value = 1
  })
  
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }
  
  function getTaskStatus(task) {
    const now = new Date()
    const dueDate = new Date(task.due_date)
    
    if (task.is_completed) return 'Completed'
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
  
  function editTask(task) {
    editingTask.value = task
    showCreateModal.value = true
  }
  
  function viewTask(task) {
    router.push(`/tasks/${task.id}`)
  }
  
  async function deleteTask(task) {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await removeTask(task.id)
        emit('notification:show', {
          type: 'success',
          title: 'Task Deleted',
          message: 'Task has been deleted successfully.'
        })
      } catch (error) {
        emit('notification:show', {
          type: 'error',
          title: 'Error',
          message: 'Failed to delete task. Please try again.'
        })
      }
    }
  }
  
  function closeModal() {
    showCreateModal.value = false
    editingTask.value = null
  }
  
  function handleTaskSaved() {
    closeModal()
    fetchTasks()
    emit('notification:show', {
      type: 'success',
      title: editingTask.value ? 'Task Updated' : 'Task Created',
      message: editingTask.value ? 'Task has been updated successfully.' : 'New task has been created successfully.'
    })
  }
  </script>