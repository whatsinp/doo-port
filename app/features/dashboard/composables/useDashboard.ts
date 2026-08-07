import { ref, watchEffect, computed } from 'vue'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import type { Holding } from '~/features/portfolio/composables/useHoldings'
import Decimal from 'decimal.js'

export const useDashboard = () => {
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

      // Query all holdings for the user across all portfolios
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

  const totalCostBasis = computed(() => {
    let total = new Decimal(0)
    for (const h of allHoldings.value) {
      // Assuming all holdings are in the same currency for MVP simplicity
      total = total.plus(new Decimal(h.costBasis || 0))
    }
    return total.toNumber()
  })

  return { allHoldings, loading, totalCostBasis }
}
