import { ref, watchEffect } from 'vue'
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import { v4 as uuidv4 } from 'uuid'

export interface Portfolio {
  id: string
  userId: string
  name: string
  description?: string
  createdAt: any
}

export const usePortfolios = () => {
  const { $db } = useNuxtApp()
  const auth = useAuth()
  const portfolios = ref<Portfolio[]>([])
  const loading = ref(true)

  if (import.meta.client) {
    watchEffect((onCleanup) => {
      const user = auth.user.value
      if (!user) {
        portfolios.value = []
        loading.value = false
        return
      }

      const q = query(collection($db as any, 'portfolios'), where('userId', '==', user.uid))

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results: Portfolio[] = []
        snapshot.forEach((docSnap) => {
          results.push({ id: docSnap.id, ...docSnap.data() } as Portfolio)
        })
        // Sort by creation date or name client-side to save on indexing for MVP
        portfolios.value = results.sort((a, b) => a.name.localeCompare(b.name))
        loading.value = false
      })

      onCleanup(() => unsubscribe())
    })
  }

  const createPortfolio = async (name: string, description: string = '') => {
    const user = auth.user.value
    if (!user) throw new Error('Not logged in')

    const id = uuidv4()
    const docRef = doc($db as any, 'portfolios', id)
    await setDoc(docRef, {
      userId: user.uid,
      name,
      description,
      createdAt: serverTimestamp()
    })
    return id
  }

  const updatePortfolio = async (id: string, name: string, description: string) => {
    const docRef = doc($db as any, 'portfolios', id)
    await setDoc(docRef, { name, description }, { merge: true })
  }

  const deletePortfolio = async (id: string) => {
    const docRef = doc($db as any, 'portfolios', id)
    await deleteDoc(docRef)
  }

  return { portfolios, loading, createPortfolio, updatePortfolio, deletePortfolio }
}
