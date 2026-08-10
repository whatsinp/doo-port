import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId
  }

  // Initialize Firebase only once
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  // Change to true to use local Firebase emulators
  const useEmulator = false

  // Connect to local emulators if in development
  if (useEmulator && process.env.NODE_ENV === 'development') {
    // Only connect if not already connected (prevent HMR errors)
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    }
    try {
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
    } catch (e) {
      // Ignore "already configured" error during hot-reload
    }
    try {
      connectStorageEmulator(storage, '127.0.0.1', 9199)
    } catch (e) {}
  }

  return {
    provide: {
      firebaseApp: app,
      auth,
      db,
      storage
    }
  }
})
