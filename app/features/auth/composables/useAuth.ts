import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  confirmPasswordReset
} from 'firebase/auth'
import type { User, ActionCodeSettings, getAuth } from 'firebase/auth'
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

  const resetPassword = async (email: string, actionCodeSettings?: ActionCodeSettings) => {
    return await sendPasswordResetEmail($auth as ReturnType<typeof getAuth>, email, actionCodeSettings)
  }

  const confirmResetPassword = async (oobCode: string, newPassword: string) => {
    return await confirmPasswordReset($auth as ReturnType<typeof getAuth>, oobCode, newPassword)
  }

  const reauthenticate = async (password: string) => {
    if (!user.value || !user.value.email) throw new Error('User not logged in or email is missing')
    const credential = EmailAuthProvider.credential(user.value.email, password)
    await reauthenticateWithCredential(user.value, credential)
  }

  const changePassword = async (newPassword: string) => {
    if (!user.value) throw new Error('User not logged in')
    await updatePassword(user.value, newPassword)
  }

  const sendVerificationEmail = async (actionCodeSettings?: ActionCodeSettings) => {
    if (!user.value) throw new Error('User not logged in')
    await sendEmailVerification(user.value, actionCodeSettings)
  }

  return {
    user,
    loading,
    loginWithEmail,
    registerWithEmail,
    logout,
    resetPassword,
    confirmResetPassword,
    reauthenticate,
    changePassword,
    sendVerificationEmail
  }
}
