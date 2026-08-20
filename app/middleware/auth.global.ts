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

  const publicRoutes = ['/login', '/register', '/auth', '/forgot-password', '/reset-password', '/', '/verify-email']

  if (!user && !publicRoutes.includes(to.path)) {
    return navigateTo('/auth?mode=login')
  }

  if (user) {
    const isUnverified = !(user as any).emailVerified

    // If unverified and trying to access a protected route, send to verify-email
    if (isUnverified && !publicRoutes.includes(to.path)) {
      return navigateTo('/verify-email')
    }

    // If verified and trying to access login/register/verify-email, send to dashboard
    if (!isUnverified && (to.path === '/login' || to.path === '/register' || to.path === '/auth' || to.path === '/verify-email')) {
      return navigateTo('/dashboard')
    }
  }
})
