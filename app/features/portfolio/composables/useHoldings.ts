import { ref, watchEffect } from 'vue'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'

export interface Holding {
  id: string
  assetSymbol: string
  quantity: string
  costBasis: string
  averageCost: string
  tradeCurrency: string
}

export const useHoldings = (portfolioId: string) => {
  const { $db } = useNuxtApp()
  const auth = useAuth()
  const holdings = ref<Holding[]>([])
  const loading = ref(true)

  if (import.meta.client) {
    watchEffect((onCleanup) => {
      const user = auth.user.value
      if (!user || !portfolioId) {
        holdings.value = []
        loading.value = false
        return
      }

      const q = query(
        collection($db as any, 'holdings'),
        where('userId', '==', user.uid),
        where('portfolioId', '==', portfolioId)
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results: Holding[] = []
        snapshot.forEach((docSnap) => {
          results.push({ id: docSnap.id, ...docSnap.data() } as Holding)
        })
        holdings.value = results.sort((a, b) => a.assetSymbol.localeCompare(b.assetSymbol))
        loading.value = false
      })

      onCleanup(() => unsubscribe())
    })
  }

  return { holdings, loading }
}
