<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <KeyIcon class="h-6 w-6 text-white" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
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
                <div>
                  <p class="text-sm font-medium">Reset link sent!</p>
                  <p class="text-sm mt-1">{{ success }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div class="mt-1 relative">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                :class="{ 'border-red-300': emailError }"
                placeholder="Enter your email address"
                @blur="validateEmail"
                :disabled="success"
              >
              <EnvelopeIcon class="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>
  
          <div>
            <button
              type="submit"
              :disabled="loading || !email || emailError || success"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </span>
              <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                <PaperAirplaneIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {{ loading ? 'Sending...' : success ? 'Email Sent' : 'Send Reset Link' }}
            </button>
          </div>
  
          <div v-if="success && resendCountdown > 0" class="text-center">
            <p class="text-sm text-gray-600">
              Didn't receive the email? You can resend in {{ resendCountdown }} seconds
            </p>
          </div>
          
          <div v-if="success && resendCountdown === 0" class="text-center">
            <button
              type="button"
              @click="handleResend"
              class="text-sm text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
            >
              Resend reset link
            </button>
          </div>
  
          <div class="text-center">
            <router-link 
              to="/login" 
              class="text-sm text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out flex items-center justify-center"
            >
              <ArrowLeftIcon class="h-4 w-4 mr-1" />
              Back to login
            </router-link>
          </div>
        </form>
        
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-sm font-medium text-blue-800 mb-2">Need help?</h3>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure you entered the correct email</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import { useEventBus } from '@/composables/useEventBus'
  import {
    KeyIcon,
    EnvelopeIcon,
    PaperAirplaneIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const authStore = useAuthStore()
  const { emit } = useEventBus()
  
  const { forgotPassword, loading, error: authError, clearError } = authStore
  
  const email = ref('')
  const emailError = ref('')
  const success = ref('')
  const error = ref('')
  const resendCountdown = ref(0)
  let countdownInterval = null
  
  onMounted(() => {
    clearError()
  })
  
  onUnmounted(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
  })
  
  function validateEmail() {
    emailError.value = ''
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.value) {
      emailError.value = 'Email is required'
    } else if (!emailRegex.test(email.value)) {
      emailError.value = 'Please enter a valid email address'
    }
  }
  
  function startResendCountdown() {
    resendCountdown.value = 60
    countdownInterval = setInterval(() => {
      resendCountdown.value--
      if (resendCountdown.value <= 0) {
        clearInterval(countdownInterval)
      }
    }, 1000)
  }
  
  async function handleForgotPassword() {
    clearError()
    error.value = ''
    success.value = ''
    
    validateEmail()
    
    if (emailError.value) {
      error.value = 'Please enter a valid email address'
      return
    }
    
    try {
      await forgotPassword(email.value)
      success.value = `We've sent a password reset link to ${email.value}. Please check your email and follow the instructions.`
      startResendCountdown()
      
      emit('notification:show', {
        type: 'success',
        title: 'Reset link sent',
        message: 'Check your email for the password reset link.'
      })
    } catch (err) {
      error.value = authError.value || 'Failed to send reset email. Please try again.'
      
      emit('notification:show', {
        type: 'error',
        title: 'Error',
        message: 'Failed to send reset email. Please try again.'
      })
    }
  }
  
  async function handleResend() {
    await handleForgotPassword()
  }
  </script>