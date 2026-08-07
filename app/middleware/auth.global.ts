import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side for MVP to avoid SSR hydration mismatch with Firebase Auth
  if (import.meta.server) return

  const auth = getAuth()

  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

  const publicRoutes = ['/login', '/register', '/forgot-password', '/']

  if (!user && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (user && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard')
  }
})
