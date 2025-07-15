<template>
    <div class="task-list">
      <div class="mb-6">
        <SearchBar @search="handleSearch" />
      </div>
      
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold">Tasks ({{ taskCount }})</h2>
        <SortControls @sort="handleSort" />
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <div v-else-if="tasks.length === 0" class="text-center py-8 text-gray-500">
        No tasks found
      </div>
      
      <div v-else class="space-y-4">
        <TaskCard 
          v-for="task in tasks" 
          :key="task.id" 
          :task="task"
          @edit="editTask"
          @delete="deleteTask"
        />
      </div>
      
      <Pagination 
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed } from 'vue'
  import { useTaskStore } from '@/stores/taskStore'
  import { useEventBus } from '@/composables/useEventBus'
  import TaskCard from './TaskCard.vue'
  import SearchBar from './SearchBar.vue'
  import SortControls from './SortControls.vue'
  import Pagination from './Pagination.vue'
  
  const taskStore = useTaskStore()
  const { on } = useEventBus()
  
  const { 
    tasks, 
    loading, 
    error, 
    currentPage, 
    totalPages,
    fetchTasks,
    deleteTask as removeTask,
    setSorting,
    setSearchQuery
  } = taskStore
  
  const taskCount = computed(() => tasks.length)
  
  onMounted(() => {
    fetchTasks()
    
    on('task:created', fetchTasks)
    on('task:updated', fetchTasks)
  })
  
  function handleSearch(query) {
    setSearchQuery(query)
  }
  
  function handleSort(field, direction) {
    setSorting(field, direction)
  }
  
  function handlePageChange(page) {
    currentPage.value = page
    fetchTasks()
  }
  
  function editTask(task) {
    emit('task:edit', task)
  }
  
  function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      removeTask(taskId)
    }
  }
  </script>