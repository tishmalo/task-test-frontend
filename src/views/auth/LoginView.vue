<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <LockClosedIcon class="h-8 w-8 text-white" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <div class="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm">{{ error }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <CheckCircleIcon class="h-5 w-5 text-green-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm">{{ success }}</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div class="relative">
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    autocomplete="email"
                    class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                    :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': emailError }"
                    placeholder="Enter your email"
                    @blur="validateEmail"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <EnvelopeIcon class="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
              </div>
              
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    class="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                    :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': passwordError }"
                    placeholder="Enter your password"
                    @blur="validatePassword"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition duration-150 ease-in-out"
                      @click="showPassword = !showPassword"
                    >
                      <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                      <EyeSlashIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
              </div>
            </div>
  
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember"
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <label for="remember" class="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
  
              <div class="text-sm">
                <router-link 
                  to="/forgot-password"
                  class="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                >
                  Forgot your password?
                </router-link>
              </div>
            </div>
  
            <div>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out transform hover:scale-105"
              >
                <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </span>
                <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRightOnRectangleIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition duration-150 ease-in-out" />
                </span>
                {{ loading ? 'Signing in...' : 'Sign in' }}
              </button>
            </div>
  
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
  
            <div class="text-center">
              <router-link
                to="/register"
                class="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlusIcon class="h-5 w-5 text-gray-400 group-hover:text-gray-500 transition duration-150 ease-in-out" />
                </span>
                Create new account
              </router-link>
            </div>
          </form>
        </div>
  
        <div class="text-center">
          <p class="text-xs text-gray-500">
            By signing in, you agree to our 
            <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
            and 
            <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </p>
        </div>
  
    
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { useEventBus } from '@/composables/useEventBus'
  import {
    LockClosedIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    UserPlusIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const { emit } = useEventBus()
  
  const { login, loading, error: authError, clearError } = authStore
  
  const form = reactive({
    email: '',
    password: '',
    remember: false
  })
  
  const showPassword = ref(false)
  const error = ref('')
  const success = ref('')
  const emailError = ref('')
  const passwordError = ref('')
  
  const isFormValid = computed(() => {
    return form.email && 
           form.password && 
           !emailError.value && 
           !passwordError.value
  })
  
  function validateEmail() {
    emailError.value = ''
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email) {
      emailError.value = 'Email is required'
    } else if (!emailRegex.test(form.email)) {
      emailError.value = 'Please enter a valid email address'
    }
  }
  
  function validatePassword() {
    passwordError.value = ''
    
    if (!form.password) {
      passwordError.value = 'Password is required'
    } else if (form.password.length < 6) {
      passwordError.value = 'Password must be at least 6 characters'
    }
  }
  

  
  async function handleLogin() {
    clearError()
    error.value = ''
    success.value = ''
    
    validateEmail()
    validatePassword()
    
    if (!isFormValid.value) {
      error.value = 'Please fix the errors above'
      return
    }
    
    try {
      await login({
        email: form.email,
        password: form.password
      })
      
      success.value = 'Login successful! Redirecting...'
      
      emit('notification:show', {
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully logged in.'
      })
      
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (err) {
      if (err.response?.status === 422) {
        error.value = 'Invalid email or password. Please try again.'
      } else if (err.response?.status === 429) {
        error.value = 'Too many login attempts. Please try again later.'
      } else {
        error.value = authError.value || 'Login failed. Please check your credentials and try again.'
      }
      
      emit('notification:show', {
        type: 'error',
        title: 'Login Failed',
        message: error.value
      })
    }
  }
  </script>
  
