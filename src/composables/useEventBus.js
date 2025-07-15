import { ref } from 'vue'

const eventBus = ref(new Map())

export function useEventBus() {
  const emit = (event, data) => {
    if (eventBus.value.has(event)) {
      eventBus.value.get(event).forEach(callback => callback(data))
    }
  }
  
  const on = (event, callback) => {
    if (!eventBus.value.has(event)) {
      eventBus.value.set(event, [])
    }
    eventBus.value.get(event).push(callback)
  }
  
  const off = (event, callback) => {
    if (eventBus.value.has(event)) {
      const callbacks = eventBus.value.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  
  return { emit, on, off }
}