<template>
  <div id="app" class="min-h-screen">
    <AppNavigation />
    
    <main class="flex-1 bg-gray-50">
      <router-view />
    </main>
    
    <NotificationContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppNavigation from '@/components/AppNavigation.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { useEventBus } from '@/composables/useEventBus'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const { on } = useEventBus()

onMounted(async () => {
  await authStore.initializeAuth()
  
  if (authStore.isAuthenticated) {
    taskStore.initializeTasks()
    setTimeout(() => {
      taskStore.fetchTasks(true)
    }, 1000)
  }
  
  on('auth:login', () => {
    console.log('User logged in')
    taskStore.fetchTasks(true)
  })
  
  on('auth:logout', () => {
    console.log('User logged out')
    taskStore.tasks = []
    localStorage.removeItem('tasks')
    localStorage.removeItem('tasksTimestamp')
  })
})
</script>