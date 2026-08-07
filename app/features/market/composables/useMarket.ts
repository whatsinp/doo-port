import { ref } from 'vue'

export interface MarketSearchResult {
  symbol: string
  name: string
  currency: string
  exchange: string
  type: string
}

export const useMarket = () => {
  const loading = ref(false)
  const results = ref<MarketSearchResult[]>([])
  const errorMsg = ref('')

  const searchAssets = async (query: string) => {
    if (!query.trim()) {
      results.value = []
      return
    }

    loading.value = true
    errorMsg.value = ''

    try {
      // Calling our mock market endpoint
      const response = await $fetch<{ success: boolean; data: MarketSearchResult[] }>(
        `http://127.0.0.1:5001/gen-lang-client-0765785441/us-central1/api/api/v1/market/search?query=${encodeURIComponent(query)}`
      )

      if (response.success) {
        results.value = response.data
      } else {
        errorMsg.value = 'Failed to fetch results'
      }
    } catch (e: any) {
      errorMsg.value = e.message || 'An error occurred while searching'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  return { loading, results, errorMsg, searchAssets }
}
