import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { taskService } from '@/services/taskService';
import { useEventBus } from '@/composables/useEventBus';

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref(localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : []);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(localStorage.getItem('currentPage') ? parseInt(localStorage.getItem('currentPage')) : 1);
  const totalPages = ref(localStorage.getItem('totalPages') ? parseInt(localStorage.getItem('totalPages')) : 1);
  const searchQuery = ref(localStorage.getItem('searchQuery') || '');
  const sortField = ref(localStorage.getItem('sortField') || 'created_at');
  const sortDirection = ref(localStorage.getItem('sortDirection') || 'desc');

  const { emit } = useEventBus();

  const overdueTasks = computed(() => tasks.value.filter(task => task.is_overdue));
  const taskCount = computed(() => tasks.value.length);

      function syncToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
    localStorage.setItem('currentPage', currentPage.value.toString());
    localStorage.setItem('totalPages', totalPages.value.toString());
    localStorage.setItem('searchQuery', searchQuery.value);
    localStorage.setItem('sortField', sortField.value);
    localStorage.setItem('sortDirection', sortDirection.value);
    localStorage.setItem('tasksTimestamp', Date.now().toString());
  }

  async function fetchTasks(forceRefresh = false) {
    if (tasks.value.length > 0 && !forceRefresh) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const params = {
        page: currentPage.value,
        search: searchQuery.value,
        sort: sortField.value,
        direction: sortDirection.value,
      };

      const response = await taskService.getTasks(params);
      tasks.value = response.data;
      totalPages.value = response.meta?.last_page || 1;

      syncToLocalStorage();
      emit('tasks:loaded', tasks.value);
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks';
      emit('tasks:error', err);

      const cachedTasks = localStorage.getItem('tasks');
      if (cachedTasks) {
        try {
          tasks.value = JSON.parse(cachedTasks);
        } catch (parseErr) {
          console.error('Failed to parse cached tasks:', parseErr);
          tasks.value = [];
        }
      }
    } finally {
      loading.value = false;
    }
  }

  async function createTask(taskData) {
    try {
      const response = await taskService.createTask(taskData);
      tasks.value.unshift(response.data);

      syncToLocalStorage();
      emit('task:created', response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create task';
      throw err;
    }
  }

  async function updateTask(id, taskData) {
    try {
      const response = await taskService.updateTask(id, taskData);
      const index = tasks.value.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks.value[index] = response.data;
      }

      syncToLocalStorage();
      emit('task:updated', response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update task';
      throw err;
    }
  }

  async function deleteTask(id) {
    try {
      await taskService.deleteTask(id);
      tasks.value = tasks.value.filter(task => task.id !== id);

      syncToLocalStorage();
      emit('task:deleted', id);
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete task';
      throw err;
    }
  }

  function setSearchQuery(query) {
    searchQuery.value = query;
    currentPage.value = 1;
    syncToLocalStorage();
    fetchTasks(true);
  }

  function setSorting(field, direction) {
    sortField.value = field;
    sortDirection.value = direction;
    currentPage.value = 1;
    syncToLocalStorage();
    fetchTasks(true);
  }

  async function initializeTasks() {
    const cachedTasks = localStorage.getItem('tasks');
    const timestamp = localStorage.getItem('tasksTimestamp');
    const cachedCurrentPage = localStorage.getItem('currentPage');
    const cachedTotalPages = localStorage.getItem('totalPages');
    const cachedSearchQuery = localStorage.getItem('searchQuery');
    const cachedSortField = localStorage.getItem('sortField');
    const cachedSortDirection = localStorage.getItem('sortDirection');

    if (cachedTasks && timestamp) {
      try {
        const cacheAge = Date.now() - parseInt(timestamp);
        const isCacheValid = cacheAge < 30 * 60 * 1000; 

        if (isCacheValid) {
          tasks.value = JSON.parse(cachedTasks);
          currentPage.value = cachedCurrentPage ? parseInt(cachedCurrentPage) : 1;
          totalPages.value = cachedTotalPages ? parseInt(cachedTotalPages) : 1;
          searchQuery.value = cachedSearchQuery || '';
          sortField.value = cachedSortField || 'created_at';
          sortDirection.value = cachedSortDirection || 'desc';
        } else {
          tasks.value = [];
          currentPage.value = 1;
          totalPages.value = 1;
          searchQuery.value = '';
          sortField.value = 'created_at';
          sortDirection.value = 'desc';
          syncToLocalStorage();
          await fetchTasks(true);
        }
      } catch (err) {
        console.error('Failed to parse cached tasks:', err);
        tasks.value = [];
        syncToLocalStorage();
        await fetchTasks(true);
      }
    } else {
      tasks.value = [];
      syncToLocalStorage();
      await fetchTasks(true);
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    tasks,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    overdueTasks,
    taskCount,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSearchQuery,
    setSorting,
    initializeTasks,
    clearError,
  };
});