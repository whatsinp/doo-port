import { ref, watchEffect } from 'vue'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useI18n } from '#imports'

export interface UserProfile {
  language: string
  theme: 'light' | 'dark'
  defaultCurrency: string
  avatarUrl?: string
  bannerUrl?: string
  nickname?: string
}

export const useProfile = () => {
  const { $db } = useNuxtApp()
  const auth = useAuth()
  const profile = ref<UserProfile | null>(null)
  const loading = ref(true)
  const { setLocale } = useI18n()

  if (import.meta.client) {
    watchEffect((onCleanup) => {
      const user = auth.user.value
      if (!user) {
        profile.value = null
        loading.value = false
        return
      }

      const docRef = doc($db as any, 'users', user.uid)
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserProfile
          profile.value = data

          // Apply Theme
          if (data.theme === 'dark') {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }

          // Apply Language
          if (data.language) {
            setLocale(data.language)
          }
        } else {
          // Setup default profile
          const defaultProfile: UserProfile = {
            language: 'en',
            theme: 'light',
            defaultCurrency: 'USD'
          }
          setDoc(docRef, defaultProfile, { merge: true })
        }
        loading.value = false
      })

      onCleanup(() => unsubscribe())
    })
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const user = auth.user.value
    if (!user) throw new Error('Not logged in')
    const docRef = doc($db as any, 'users', user.uid)
    await setDoc(docRef, updates, { merge: true })
  }

  return { profile, loading, updateProfile }
}
