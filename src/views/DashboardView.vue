<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, {{ user?.name }}!
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Here's what's happening with your tasks today.
            </p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <router-link
              to="/tasks"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              New Task
            </router-link>
          </div>
        </div>
  
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClipboardDocumentListIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Tasks
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.total }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ExclamationTriangleIcon class="h-6 w-6 text-red-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Overdue
                    </dt>
                    <dd class="text-lg font-medium text-red-600">
                      {{ stats.overdue }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClockIcon class="h-6 w-6 text-yellow-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Due Today
                    </dt>
                    <dd class="text-lg font-medium text-yellow-600">
                      {{ stats.dueToday }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <CheckCircleIcon class="h-6 w-6 text-green-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Completed This Week
                    </dt>
                    <dd class="text-lg font-medium text-green-600">
                      {{ stats.completedThisWeek }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Tasks
              </h3>
              <div v-if="loading" class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
              </div>
              <div v-else-if="recentTasks.length === 0" class="text-center py-8 text-gray-500">
                <ClipboardDocumentListIcon class="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No tasks yet. Create your first task!</p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="task in recentTasks"
                  :key="task.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">{{ task.title }}</h4>
                    <p class="text-xs text-gray-500 mt-1">
                      Due: {{ formatDate(task.due_date) }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getTaskStatusClass(task)"
                    >
                      {{ getTaskStatus(task) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <router-link
                  to="/tasks"
                  class="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  View all tasks →
                </router-link>
              </div>
            </div>
          </div>
  
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Upcoming Tasks
              </h3>
              <div v-if="loading" class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
              </div>
              <div v-else-if="upcomingTasks.length === 0" class="text-center py-8 text-gray-500">
                <CalendarDaysIcon class="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p>No upcoming tasks in the next 7 days.</p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="task in upcomingTasks"
                  :key="task.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-900">{{ task.title }}</h4>
                    <p class="text-xs text-gray-500 mt-1">
                      Due: {{ formatDate(task.due_date) }}
                    </p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getTaskStatusClass(task)"
                    >
                      {{ getTaskStatus(task) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="mt-8 bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <router-link
                to="/tasks"
                class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100">
                    <PlusIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium">
                    <span class="absolute inset-0" aria-hidden="true"></span>
                    Create Task
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Add a new task to your list
                  </p>
                </div>
              </router-link>
  
              <button
                @click="filterOverdue"
                class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-red-50 text-red-700 group-hover:bg-red-100">
                    <ExclamationTriangleIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium">View Overdue</h3>
                  <p class="mt-2 text-sm text-gray-500">
                    See tasks that need attention
                  </p>
                </div>
              </button>
  
              <button
                @click="filterToday"
                class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-500 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 group-hover:bg-yellow-100">
                    <ClockIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-4">
                  <h3 class="text-lg font-medium">Due Today</h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Tasks due today
                  </p>
                </div>
              </button>
  
          
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { useTaskStore } from '@/stores/taskStore'
  import { useEventBus } from '@/composables/useEventBus'
  import {
    PlusIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon,
    CalendarDaysIcon,
    CogIcon
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const taskStore = useTaskStore()
  const { emit } = useEventBus()
  
  const { user } = authStore
  const { tasks, loading, fetchTasks } = taskStore
  
  const stats = ref({
    total: 0,
    overdue: 0,
    dueToday: 0,
    completedThisWeek: 0
  })
  
  const recentTasks = computed(() => {
    return tasks.slice(0, 5)
  })
  
  const upcomingTasks = computed(() => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return tasks.filter(task => {
      const dueDate = new Date(task.due_date)
      return dueDate >= now && dueDate <= sevenDaysFromNow
    }).slice(0, 5)
  })
  
  onMounted(async () => {
    try {
      await fetchTasks()
      calculateStats()
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  })
  
  console.log(tasks);
  function calculateStats() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    stats.value = {
      total: tasks.length,
      overdue: tasks.filter(task => new Date(task.due_date) < today).length,
      dueToday: tasks.filter(task => {
        const taskDate = new Date(task.due_date)
        return taskDate >= today && taskDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }).length,
      completedThisWeek: tasks.filter(task => 
        task.is_completed && new Date(task.completed_at) >= weekAgo
      ).length
    }
  }
  
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
  
  function filterOverdue() {
    router.push('/tasks?filter=overdue')
  }
  
  function filterToday() {
    router.push('/tasks?filter=today')
  }
  

  </script>