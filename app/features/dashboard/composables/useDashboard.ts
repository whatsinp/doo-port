import { ref, watchEffect, computed, watch } from 'vue'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import type { Holding } from '~/features/portfolio/composables/useHoldings'
import { usePortfolios } from '~/features/portfolio/composables/usePortfolios'
import { useExchangeRate } from '~/composables/useExchangeRate'
import Decimal from 'decimal.js'

export const useDashboard = () => {
  const { $db } = useNuxtApp()
  const auth = useAuth()
  const { portfolios } = usePortfolios()
  const { exchangeRateTHB } = useExchangeRate()
  const rawHoldings = ref<Holding[]>([])
  const loading = ref(true)

  if (import.meta.client) {
    watchEffect((onCleanup) => {
      const user = auth.user.value
      if (!user) {
        rawHoldings.value = []
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
        rawHoldings.value = results
        loading.value = false
      })

      onCleanup(() => unsubscribe())
    })
  }

  const allHoldings = computed(() => {
    // Filter out holdings that belong to deleted portfolios
    const validPortfolioIds = new Set(portfolios.value.map(p => p.id))
    return rawHoldings.value.filter(h => validPortfolioIds.has(h.portfolioId))
  })

  const totalCostBasis = computed(() => {
    let total = new Decimal(0)
    for (const h of allHoldings.value) {
      if (parseFloat(h.quantity) > 0) {
        let cost = parseFloat(h.costBasis || '0')
        if (h.assetSymbol.startsWith('THAIGOLD')) cost = cost / (exchangeRateTHB.value || 33.07)
        total = total.plus(new Decimal(cost))
      }
    }
    return total.toNumber()
  })

  const aggregatedHoldings = computed(() => {
    const map = new Map<string, { symbol: string, quantity: number, costBasis: number }>()
    for (const h of allHoldings.value) {
      const qty = parseFloat(h.quantity)
      if (qty <= 0) continue
      const existing = map.get(h.assetSymbol)
      if (existing) {
        existing.quantity += qty
        existing.costBasis += parseFloat(h.costBasis)
      } else {
        map.set(h.assetSymbol, {
          symbol: h.assetSymbol,
          quantity: qty,
          costBasis: parseFloat(h.costBasis)
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.costBasis - a.costBasis)
  })

  const currentPrices = ref<Record<string, number>>({})
  const loadingPrices = ref(false)

  watch(aggregatedHoldings, async (newHoldings) => {
    if (newHoldings.length === 0) {
      currentPrices.value = {}
      return
    }
    loadingPrices.value = true
    try {
      const symbols = newHoldings.map(h => h.symbol).join(',')
      const res = await $fetch<any>(`/api/assets?symbols=${symbols}`)
      
      const prices: Record<string, number> = {}
      
      if (res) {
        if (res.stocks) {
          res.stocks.forEach((s: any) => { prices[s.symbol] = parseFloat(s.price) })
        }
        if (res.crypto) {
          res.crypto.forEach((c: any) => { prices[c.symbol] = parseFloat(c.price) })
        }
        if (res.gold) {
          prices[res.gold.symbol] = parseFloat(res.gold.price)
        }
        if (res.thaiGold) {
          res.thaiGold.forEach((g: any) => { prices[g.symbol] = parseFloat(g.price) })
        }
      }
      
      currentPrices.value = prices
    } finally {
      loadingPrices.value = false
    }
  }, { deep: true })

  const currentTotalValue = computed(() => {
    if (Object.keys(currentPrices.value).length === 0) return 0
    let total = 0
    for (const h of aggregatedHoldings.value) {
      let price = currentPrices.value[h.symbol] || (h.quantity > 0 ? h.costBasis / h.quantity : 0) // fallback to average cost if API fails
      if (h.symbol.startsWith('THAIGOLD')) price = price / (exchangeRateTHB.value || 33.07)
      total += h.quantity * price
    }
    return total
  })

  return { allHoldings, loading, totalCostBasis, aggregatedHoldings, currentPrices, loadingPrices, currentTotalValue }
}
