import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
}

const toasts = ref<ToastMessage[]>([])

export const useToast = () => {
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ ...toast, id })

    const duration = toast.duration || 4000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, title?: string, duration?: number) => addToast({ message, title, type: 'success', duration })
  const error = (message: string, title?: string, duration?: number) => addToast({ message, title, type: 'error', duration })
  const info = (message: string, title?: string, duration?: number) => addToast({ message, title, type: 'info', duration })
  const warning = (message: string, title?: string, duration?: number) => addToast({ message, title, type: 'warning', duration })

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}
