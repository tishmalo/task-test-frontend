<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
  
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleSubmit">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {{ task ? 'Edit Task' : 'Create New Task' }}
                  </h3>
                  
                  <div class="mb-4">
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      id="title"
                      v-model="form.title"
                      type="text"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter task title"
                    >
                  </div>
                  
                  <div class="mb-4">
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter task description (optional)"
                    ></textarea>
                  </div>
                  
                  <div class="mb-4">
                    <label for="due_date" class="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      id="due_date"
                      v-model="form.due_date"
                      type="datetime-local"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                :disabled="loading"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task') }}
              </button>
              <button
                type="button"
                @click="$emit('close')"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, watch } from 'vue'
  import { useTaskStore } from '@/stores/taskStore'
  
  const props = defineProps({
    show: Boolean,
    task: Object
  })
  
  const emit = defineEmits(['close', 'saved'])
  
  const taskStore = useTaskStore()
  const { createTask, updateTask } = taskStore
  
  const loading = ref(false)
  const form = reactive({
    title: '',
    description: '',
    due_date: ''
  })
  
  watch(() => props.task, (newTask) => {
    if (newTask) {
      form.title = newTask.title
      form.description = newTask.description || ''
      const dueDate = new Date(newTask.due_date)
      form.due_date = dueDate.toISOString().slice(0, 16)
    } else {
      resetForm()
    }
  }, { immediate: true })
  
  watch(() => props.show, (isShow) => {
    if (isShow && !props.task) {
      resetForm()
    }
  })
  
  function resetForm() {
    form.title = ''
    form.description = ''
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    form.due_date = tomorrow.toISOString().slice(0, 16)
  }
  
  async function handleSubmit() {
    loading.value = true
    
    try {
      const taskData = {
        title: form.title,
        description: form.description || null,
        due_date: new Date(form.due_date).toISOString()
      }
      
      if (props.task) {
        await updateTask(props.task.id, taskData)
      } else {
        await createTask(taskData)
      }
      
      emit('saved')
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      loading.value = false
    }
  }
  </script>