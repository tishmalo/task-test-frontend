<template>
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <transition-group
        name="notification"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="notificationClasses(notification.type)"
          class="max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component :is="getIcon(notification.type)" class="h-6 w-6" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium">
                  {{ notification.title }}
                </p>
                <p v-if="notification.message" class="mt-1 text-sm">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeNotification(notification.id)"
                  class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  import { useEventBus } from '@/composables/useEventBus'
  
  const notifications = ref([])
  const { on } = useEventBus()
  
  onMounted(() => {
    on('notification:show', showNotification)
    on('auth:login', () => {
      showNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully logged in.'
      })
    })
    
    on('auth:logout', () => {
      showNotification({
        type: 'info',
        title: 'Logged out',
        message: 'You have been logged out successfully.'
      })
    })
    
    on('task:created', () => {
      showNotification({
        type: 'success',
        title: 'Task created',
        message: 'Your task has been created successfully.'
      })
    })
  })
  
  function showNotification(notification) {
    const id = Date.now()
    notifications.value.push({
      id,
      ...notification
    })
    
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }
  
  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  function notificationClasses(type) {
    const baseClasses = 'bg-white border-l-4'
    
    switch (type) {
      case 'success':
        return `${baseClasses} border-green-400`
      case 'error':
        return `${baseClasses} border-red-400`
      case 'warning':
        return `${baseClasses} border-yellow-400`
      case 'info':
      default:
        return `${baseClasses} border-blue-400`
    }
  }
  
  function getIcon(type) {
    switch (type) {
      case 'success':
        return CheckCircleIcon
      case 'error':
        return XCircleIcon
      case 'warning':
        return ExclamationTriangleIcon
      case 'info':
      default:
        return InformationCircleIcon
    }
  }
  </script>
  
  <style scoped>
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  
  .notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  </style>