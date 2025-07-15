<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <UserPlusIcon class="h-6 w-6 text-white" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Join us and start managing your tasks efficiently
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
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
          
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div class="mt-1 relative">
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  :class="{ 'border-red-300': errors.name }"
                  placeholder="Enter your full name"
                  @blur="validateField('name')"
                >
                <UserIcon class="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div class="mt-1 relative">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  :class="{ 'border-red-300': errors.email }"
                  placeholder="Enter your email address"
                  @blur="validateField('email')"
                >
                <EnvelopeIcon class="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  :class="{ 'border-red-300': errors.password }"
                  placeholder="Create a strong password"
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
                Confirm Password
              </label>
              <div class="mt-1 relative">
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  :class="{ 'border-red-300': errors.password_confirmation }"
                  placeholder="Confirm your password"
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
  
          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            >
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              I agree to the 
              <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
              and 
              <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
            </label>
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
              <span v-if="!loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </div>
  
          <div class="text-center">
            <span class="text-sm text-gray-600">
              Already have an account?
              <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                Sign in here
              </router-link>
            </span>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { useEventBus } from '@/composables/useEventBus'
  import {
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    UserPlusIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  const authStore = useAuthStore()
  const { emit } = useEventBus()
  
  const { register, loading, error: authError, clearError } = authStore
  
  const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    acceptTerms: false
  })
  
  const errors = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const success = ref('')
  const error = ref('')
  
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
    return form.name && 
           form.email && 
           form.password && 
           form.password_confirmation && 
           form.acceptTerms &&
           !Object.values(errors).some(error => error)
  })
  
  function validateField(field) {
    errors[field] = ''
    
    switch (field) {
      case 'name':
        if (!form.name) {
          errors.name = 'Name is required'
        } else if (form.name.length < 2) {
          errors.name = 'Name must be at least 2 characters'
        }
        break
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!form.email) {
          errors.email = 'Email is required'
        } else if (!emailRegex.test(form.email)) {
          errors.email = 'Please enter a valid email address'
        }
        break
        
      case 'password':
        if (!form.password) {
          errors.password = 'Password is required'
        } else if (form.password.length < 8) {
          errors.password = 'Password must be at least 8 characters'
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
  
  async function handleRegister() {
    clearError()
    error.value = ''
    success.value = ''
    
    Object.keys(form).forEach(field => {
      if (field !== 'acceptTerms') {
        validateField(field)
      }
    })
    
    if (!isFormValid.value) {
      error.value = 'Please fix the errors above'
      return
    }
    
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation
      })
      
      success.value = 'Account created successfully! Redirecting...'
      emit('notification:show', {
        type: 'success',
        title: 'Welcome!',
        message: 'Your account has been created successfully.'
      })
      
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.keys(err.response.data.errors).forEach(key => {
          if (errors.hasOwnProperty(key)) {
            errors[key] = err.response.data.errors[key][0]
          }
        })
      }
      error.value = authError.value || 'Registration failed. Please try again.'
    }
  }
  </script>