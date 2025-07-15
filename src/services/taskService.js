import api from './api'

export const taskService = {
  async getTasks(params = {}) {
    const response = await api.get('/tasks', { params })
    return response.data
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  async createTask(task) {
    const response = await api.post('/tasks', task)
    return response.data
  },

  async updateTask(id, task) {
    const response = await api.put(`/tasks/${id}`, task)
    return response.data
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },
}