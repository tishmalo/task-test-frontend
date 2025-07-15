import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/authService';
import { useEventBus } from '@/composables/useEventBus';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const loading = ref(false);
  const error = ref(null);

  const { emit } = useEventBus();

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  function syncToLocalStorage() {
    if (token.value) {
      localStorage.setItem('token', token.value);
    } else {
      localStorage.removeItem('token');
    }
    if (user.value) {
      localStorage.setItem('user', JSON.stringify(user.value));
    } else {
      localStorage.removeItem('user');
    }
  }

  async function register(userData) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.register(userData);
      user.value = response.user;
      token.value = response.token;

      syncToLocalStorage();
      emit('auth:registered', response.user);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function login(credentials) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      user.value = response.user;
      token.value = response.token;

      syncToLocalStorage();
      emit('auth:login', response.user);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;

    try {
      if (token.value) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      user.value = null;
      token.value = null;
      syncToLocalStorage();
      emit('auth:logout');
      loading.value = false;
    }
  }

  async function forgotPassword(email) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.forgotPassword(email);
      emit('auth:password-reset-sent', email);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to send reset email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(data) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.resetPassword(data);
      emit('auth:password-reset', data.email);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Password reset failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) {
      user.value = null;
      syncToLocalStorage();
      return;
    }

    try {
      const userData = await authService.getUser();
      user.value = userData;
      syncToLocalStorage();
    } catch (err) {
      console.error('Failed to fetch user:', err);
      await logout();
    }
  }

  async function initializeAuth() {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);

        await fetchUser();
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        await logout();
      }
    } else {
      token.value = null;
      user.value = null;
      syncToLocalStorage();
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    fetchUser,
    initializeAuth,
    clearError,
  };
});