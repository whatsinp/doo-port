import { ref, watchEffect } from 'vue'
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  getDocs
} from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import { v4 as uuidv4 } from 'uuid'

export interface Portfolio {
  id: string
  userId: string
  name: string
  description?: string
  order?: number
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
        // Sort by order first, then by name
        portfolios.value = results.sort((a, b) => {
          const orderA = a.order ?? 9999
          const orderB = b.order ?? 9999
          if (orderA !== orderB) return orderA - orderB
          return a.name.localeCompare(b.name)
        })
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
      order: portfolios.value.length,
      createdAt: serverTimestamp()
    })
    return id
  }

  const updatePortfolio = async (id: string, name: string, description: string) => {
    const docRef = doc($db as any, 'portfolios', id)
    await setDoc(docRef, { name, description }, { merge: true })
  }

  const updatePortfolioOrder = async (newOrders: { id: string, order: number }[]) => {
    const batch = writeBatch($db as any)
    for (const item of newOrders) {
      const docRef = doc($db as any, 'portfolios', item.id)
      batch.update(docRef, { order: item.order })
    }
    await batch.commit()
  }

  const deletePortfolio = async (id: string) => {
    // Find all holdings and transactions for this portfolio
    const holdingsQ = query(collection($db as any, 'holdings'), where('portfolioId', '==', id))
    const txQ = query(collection($db as any, 'transactions'), where('portfolioId', '==', id))
    
    const [holdingsSnap, txSnap] = await Promise.all([
      getDocs(holdingsQ),
      getDocs(txQ)
    ])

    const deletePromises: Promise<void>[] = []
    
    holdingsSnap.forEach(docSnap => {
      deletePromises.push(deleteDoc(docSnap.ref))
    })
    
    txSnap.forEach(docSnap => {
      deletePromises.push(deleteDoc(docSnap.ref))
    })

    // Delete the portfolio document itself
    const docRef = doc($db as any, 'portfolios', id)
    deletePromises.push(deleteDoc(docRef))

    await Promise.all(deletePromises)
  }

  return { portfolios, loading, createPortfolio, updatePortfolio, updatePortfolioOrder, deletePortfolio }
}
