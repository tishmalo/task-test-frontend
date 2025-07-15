<template>
    <nav class="bg-white shadow-lg w-full block relative top-0 left-0 right-0" style="display: block; width: 100%; position: relative;">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-900">Task Manager</h1>
            </router-link>
            
            <div v-if="isAuthenticated" class="hidden md:ml-6 md:flex md:items-center md:space-x-8">
              <router-link
                to="/"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-gray-900 bg-gray-100"
              >
                Dashboard
              </router-link>
              <router-link
                to="/tasks"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-gray-900 bg-gray-100"
              >
                Tasks
              </router-link>
            </div>
          </div>
  
          <div class="flex items-center space-x-4">
            <div v-if="isAuthenticated" class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">Welcome, {{ user?.name }}</span>
              <button
                @click="handleLogout"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
            
            <div v-else class="flex items-center space-x-4">
              <router-link
                to="/login"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign Up
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const { user, isAuthenticated, logout } = authStore
  
  async function handleLogout() {
    await logout()
    router.push('/login')
  }
  </script>