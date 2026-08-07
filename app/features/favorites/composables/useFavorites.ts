import { ref, watchEffect } from 'vue'
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'

export interface Favorite {
  id: string // symbol
  userId: string
  symbol: string
  name: string
  addedAt: any
}

export const useFavorites = () => {
  const { $db } = useNuxtApp()
  const auth = useAuth()
  const favorites = ref<Favorite[]>([])
  const loading = ref(true)

  if (import.meta.client) {
    watchEffect((onCleanup) => {
      const user = auth.user.value
      if (!user) {
        favorites.value = []
        loading.value = false
        return
      }

      const q = query(collection($db as any, 'favorites'), where('userId', '==', user.uid))

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results: Favorite[] = []
        snapshot.forEach((docSnap) => {
          results.push({ id: docSnap.id, ...docSnap.data() } as Favorite)
        })
        favorites.value = results.sort((a, b) => a.symbol.localeCompare(b.symbol))
        loading.value = false
      })

      onCleanup(() => unsubscribe())
    })
  }

  const toggleFavorite = async (symbol: string, name: string) => {
    const user = auth.user.value
    if (!user) return

    const docId = `${user.uid}_${symbol}`
    const docRef = doc($db as any, 'favorites', docId)

    const existing = favorites.value.find((f) => f.symbol === symbol)
    if (existing) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, {
        userId: user.uid,
        symbol,
        name,
        addedAt: new Date().toISOString()
      })
    }
  }

  return { favorites, loading, toggleFavorite }
}
