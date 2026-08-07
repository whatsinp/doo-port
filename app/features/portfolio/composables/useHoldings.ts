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
  portfolioId?: string
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

      let q;
      if (portfolioId === 'all') {
        q = query(collection($db as any, 'holdings'), where('userId', '==', user.uid))
      } else {
        q = query(
          collection($db as any, 'holdings'),
          where('userId', '==', user.uid),
          where('portfolioId', '==', portfolioId)
        )
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results: Holding[] = []
        snapshot.forEach((docSnap) => {
          results.push({ id: docSnap.id, ...docSnap.data() } as Holding)
        })

        if (portfolioId === 'all') {
          const aggregated = new Map<string, Holding>()
          for (const h of results) {
            if (!aggregated.has(h.assetSymbol)) {
              aggregated.set(h.assetSymbol, { ...h })
            } else {
              const existing = aggregated.get(h.assetSymbol)!
              const newQty = parseFloat(existing.quantity) + parseFloat(h.quantity)
              const newCostBasis = parseFloat(existing.costBasis) + parseFloat(h.costBasis)
              const newAvgCost = newQty > 0 ? newCostBasis / newQty : 0
              
              aggregated.set(h.assetSymbol, {
                ...existing,
                quantity: newQty.toString(),
                costBasis: newCostBasis.toString(),
                averageCost: newAvgCost.toString()
              })
            }
          }
          holdings.value = Array.from(aggregated.values()).sort((a, b) => a.assetSymbol.localeCompare(b.assetSymbol))
        } else {
          holdings.value = results.sort((a, b) => a.assetSymbol.localeCompare(b.assetSymbol))
        }
        loading.value = false
      })

      onCleanup(() => unsubscribe())
    })
  }

  return { holdings, loading }
}

export const useAllUserHoldings = () => {
  const { $db } = useNuxtApp()
  const auth = useAuth()
  const allHoldings = ref<Holding[]>([])
  const loading = ref(true)

  if (import.meta.client) {
    watchEffect((onCleanup) => {
      const user = auth.user.value
      if (!user) {
        allHoldings.value = []
        loading.value = false
        return
      }

      const q = query(collection($db as any, 'holdings'), where('userId', '==', user.uid))

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results: Holding[] = []
        snapshot.forEach((docSnap) => {
          results.push({ id: docSnap.id, ...docSnap.data() } as Holding)
        })
        allHoldings.value = results
        loading.value = false
      })

      onCleanup(() => unsubscribe())
    })
  }

  return { allHoldings, loading }
}
