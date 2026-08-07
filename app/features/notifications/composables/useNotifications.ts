import { ref, watchEffect, computed } from 'vue'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  isRead: boolean
  createdAt: any
}

export const useNotifications = () => {
  const { $db } = useNuxtApp()
  const auth = useAuth()
  const notifications = ref<Notification[]>([])

  if (import.meta.client) {
    watchEffect((onCleanup) => {
      const user = auth.user.value
      if (!user) {
        notifications.value = []
        return
      }

      const q = query(collection($db as any, 'notifications'), where('userId', '==', user.uid))

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results: Notification[] = []
        snapshot.forEach((docSnap) => {
          results.push({ id: docSnap.id, ...docSnap.data() } as Notification)
        })
        notifications.value = results
      })

      onCleanup(() => unsubscribe())
    })
  }

  const unreadCount = computed(() => notifications.value.filter((n) => !n.isRead).length)

  return { notifications, unreadCount }
}
