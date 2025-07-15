<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <LockClosedIcon class="h-6 w-6 text-white" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
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
                  <p class="text-sm font-medium">Password reset successful!</p>
                  <p class="text-sm mt-1">{{ success }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div class="mt-1 relative">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  readonly
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-500 bg-gray-50 rounded-lg focus:outline-none sm:text-sm"
                >
                <EnvelopeIcon class="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  :class="{ 'border-red-300': errors.password }"
                  placeholder="Enter your new password"
                  @blur="validateField('password')"
                >
                <button
                  type="button"
                  class="absolute right-3 top-3 h-5 w-5 text-gray-400"
                  @click="showPassword = !showPassword"
                >
                  <EyeIcon v-if="!showPassword" />
                  <EyeSlashIcon v-else />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
              
              <div class="mt-2">
                <div class="flex space-x-1">
                  <div 
                    v-for="i in 4" 
                    :key="i"
                    class="h-1 w-1/4 rounded-full"
                    :class="getPasswordStrengthColor(i)"
                  ></div>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  Password strength: {{ passwordStrengthText }}
                </p>
              </div>
            </div>
            
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  :class="{ 'border-red-300': errors.password_confirmation }"
                  placeholder="Confirm your new password"
                  @blur="validateField('password_confirmation')"
                >
                <button
                  type="button"
                  class="absolute right-3 top-3 h-5 w-5 text-gray-400"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <EyeIcon v-if="!showConfirmPassword" />
                  <EyeSlashIcon v-else />
                </button>
              </div>
              <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </span>
              <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {{ loading ? 'Resetting Password...' : 'Reset Password' }}
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
  
        <div class="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-5 w-5 text-amber-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800">Security Notice</h3>
              <div class="mt-2 text-sm text-amber-700">
                <ul class="list-disc pl-5 space-y-1">
                  <li>Choose a strong password with at least 8 characters</li>
                  <li>Include uppercase, lowercase, numbers, and symbols</li>
                  <li>Don't reuse passwords from other accounts</li>
                  <li>This reset link expires in 60 minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { useEventBus } from '@/composables/useEventBus'
  import {
    LockClosedIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { emit } = useEventBus()
  
  const { resetPassword, loading, error: authError, clearError } = authStore
  
  const form = reactive({
    token: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  
  const errors = reactive({
    password: '',
    password_confirmation: ''
  })
  
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const success = ref('')
  const error = ref('')
  
  onMounted(() => {
    form.token = route.query.token || ''
    form.email = route.query.email || ''
    
    if (!form.token || !form.email) {
      error.value = 'Invalid reset link. Please request a new password reset.'
      router.push('/forgot-password')
      return
    }
    
    clearError()
  })
  
  const passwordStrength = computed(() => {
    const password = form.password
    let strength = 0
    
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    return Math.min(strength, 4)
  })
  
  const passwordStrengthText = computed(() => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return texts[passwordStrength.value] || 'Very Weak'
  })
  
  const isFormValid = computed(() => {
    return form.password && 
           form.password_confirmation && 
           form.password === form.password_confirmation &&
           form.password.length >= 8 &&
           !Object.values(errors).some(error => error)
  })
  
  // Methods
  function validateField(field) {
    errors[field] = ''
    
    switch (field) {
      case 'password':
        if (!form.password) {
          errors.password = 'Password is required'
        } else if (form.password.length < 8) {
          errors.password = 'Password must be at least 8 characters'
        }
        
        if (form.password_confirmation) {
          validateField('password_confirmation')
        }
        break
        
      case 'password_confirmation':
        if (!form.password_confirmation) {
          errors.password_confirmation = 'Password confirmation is required'
        } else if (form.password !== form.password_confirmation) {
          errors.password_confirmation = 'Passwords do not match'
        }
        break
    }
  }
  
  function getPasswordStrengthColor(index) {
    if (passwordStrength.value >= index) {
      if (passwordStrength.value <= 1) return 'bg-red-500'
      if (passwordStrength.value <= 2) return 'bg-yellow-500'
      if (passwordStrength.value <= 3) return 'bg-blue-500'
      return 'bg-green-500'
    }
    return 'bg-gray-200'
  }
  
  async function handleResetPassword() {
    clearError()
    error.value = ''
    success.value = ''
    
    validateField('password')
    validateField('password_confirmation')
    
    if (!isFormValid.value) {
      error.value = 'Please fix the errors above'
      return
    }
    
    try {
      await resetPassword(form)
      success.value = 'Your password has been reset successfully. You will be redirected to the login page in 3 seconds.'
      
      emit('notification:show', {
        type: 'success',
        title: 'Password Reset Successful',
        message: 'Your password has been reset successfully.'
      })
      
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach(key => {
          if (errors.hasOwnProperty(key)) {
            errors[key] = err.response.data.errors[key][0]
          }
        })
      }
      
      error.value = authError.value || 'Password reset failed. The reset link may have expired. Please request a new one.'
      
      emit('notification:show', {
        type: 'error',
        title: 'Reset Failed',
        message: 'Password reset failed. Please try again.'
      })
    }
  }
  </script>
  
