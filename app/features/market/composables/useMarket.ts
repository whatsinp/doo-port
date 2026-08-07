import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

export interface MarketSearchResult {
  symbol: string
  name: string
  currency: string
  exchange: string
  type: string
}

export interface MarketQuote {
  symbol: string
  name: string
  price: string
  currency: string
  changePercent: number
  dayLow: string
  dayHigh: string
  asOf: string
}

export interface ChartDataPoint {
  time: number
  value: number
}

export interface FavoriteAssetData {
  symbol: string
  name: string
  type: string
  quote: MarketQuote
  history: ChartDataPoint[]
}

export const useMarket = () => {
  const loading = ref(false)
  const results = ref<MarketSearchResult[]>([])
  const errorMsg = ref('')

  const selectedAsset = ref<MarketQuote | null>(null)
  const historicalData = ref<ChartDataPoint[]>([])
  const loadingDetails = ref(false)

  // Favorites state
  const favorites = useStorage<string[]>('doo-port-favorites', ['AAPL', 'MSFT', 'NVDA'])
  const favoritesData = ref<FavoriteAssetData[]>([])
  const loadingFavorites = ref(false)

  const toggleFavorite = (symbol: string) => {
    const idx = favorites.value.indexOf(symbol)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
      favoritesData.value = favoritesData.value.filter(f => f.symbol !== symbol)
    } else {
      favorites.value.push(symbol)
      // When added, we might want to fetch its data if we are looking at the favorites list,
      // but usually the user is looking at search results when they toggle.
    }
  }

  const isFavorite = (symbol: string) => favorites.value.includes(symbol)

  const fetchFavoritesData = async () => {
    if (favorites.value.length === 0) {
      favoritesData.value = []
      return
    }
    
    loadingFavorites.value = true
    try {
      const promises = favorites.value.map(async (symbol) => {
        const [quoteRes, histRes] = await Promise.all([
          $fetch<{ data: MarketQuote }>(`http://127.0.0.1:5001/gen-lang-client-0765785441/us-central1/api/api/v1/market/quotes/${symbol}`),
          $fetch<{ data: ChartDataPoint[] }>(`http://127.0.0.1:5001/gen-lang-client-0765785441/us-central1/api/api/v1/market/historical/${symbol}?timeframe=1D`)
        ])
        
        return {
          symbol,
          name: quoteRes.data.name,
          type: 'Stock', // We default to Stock here, or fetch from search endpoint if we had one
          quote: quoteRes.data,
          history: histRes.data
        } as FavoriteAssetData
      })
      
      favoritesData.value = await Promise.all(promises)
    } catch (e: any) {
      console.error('Failed to fetch favorites data:', e)
    } finally {
      loadingFavorites.value = false
    }
  }

  const searchAssets = async (query: string = '') => {
    loading.value = true
    errorMsg.value = ''

    try {
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

  const fetchAssetDetails = async (symbol: string, timeframe: string = '1M') => {
    loadingDetails.value = true
    try {
      const [quoteRes, histRes] = await Promise.all([
        $fetch<{ data: MarketQuote }>(`http://127.0.0.1:5001/gen-lang-client-0765785441/us-central1/api/api/v1/market/quotes/${symbol}`),
        $fetch<{ data: ChartDataPoint[] }>(`http://127.0.0.1:5001/gen-lang-client-0765785441/us-central1/api/api/v1/market/historical/${symbol}?timeframe=${timeframe}`)
      ])
      
      selectedAsset.value = quoteRes.data
      historicalData.value = histRes.data
    } catch (e: any) {
      console.error('Failed to fetch details:', e)
    } finally {
      loadingDetails.value = false
    }
  }

  return { 
    loading, 
    results, 
    errorMsg, 
    searchAssets, 
    selectedAsset, 
    historicalData, 
    loadingDetails, 
    fetchAssetDetails,
    favorites,
    favoritesData,
    loadingFavorites,
    toggleFavorite,
    isFavorite,
    fetchFavoritesData
  }
}
