import { ref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useNuxtApp } from '#app'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const user = ref<User | null>(null)
  const loading = ref(true)

  // Listen to auth state changes
  if (import.meta.client) {
    onAuthStateChanged($auth as ReturnType<typeof getAuth>, (currentUser) => {
      user.value = currentUser
      loading.value = false
    })
  }

  const loginWithEmail = async (email: string, pass: string) => {
    return await signInWithEmailAndPassword($auth as ReturnType<typeof getAuth>, email, pass)
  }

  const registerWithEmail = async (email: string, pass: string) => {
    return await createUserWithEmailAndPassword($auth as ReturnType<typeof getAuth>, email, pass)
  }

  const logout = async () => {
    return await signOut($auth as ReturnType<typeof getAuth>)
  }

  const resetPassword = async (email: string) => {
    return await sendPasswordResetEmail($auth as ReturnType<typeof getAuth>, email)
  }

  return {
    user,
    loading,
    loginWithEmail,
    registerWithEmail,
    logout,
    resetPassword
  }
}
