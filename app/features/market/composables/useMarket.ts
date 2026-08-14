import { ref, computed } from 'vue'
import { useFavorites } from '~/features/favorites/composables/useFavorites'

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
  const config = useRuntimeConfig()
  const loading = ref(false)
  const results = ref<MarketSearchResult[]>([])
  const errorMsg = ref('')

  const selectedAsset = ref<MarketQuote | null>(null)
  const historicalData = ref<ChartDataPoint[]>([])
  const loadingDetails = ref(false)

  // Favorites state
  const { favorites: dbFavorites, toggleFavorite: dbToggleFavorite } = useFavorites()
  const favorites = computed(() => dbFavorites.value.map(f => f.symbol))
  const favoritesData = ref<FavoriteAssetData[]>([])
  const loadingFavorites = ref(false)

  const toggleFavorite = async (symbol: string) => {
    // Attempt to find name from search results or selected asset
    let name = symbol
    const foundInResults = results.value.find(r => r.symbol === symbol)
    if (foundInResults) {
      name = foundInResults.name
    } else if (selectedAsset.value && selectedAsset.value.symbol === symbol) {
      name = selectedAsset.value.name
    }

    // Optimistically update local data array if removing
    if (favorites.value.includes(symbol)) {
      favoritesData.value = favoritesData.value.filter(f => f.symbol !== symbol)
    }

    await dbToggleFavorite(symbol, name)
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
        try {
          const [quoteRes, histRes] = await Promise.all([
            $fetch<any>(`/api/market/quotes/${symbol}`),
            $fetch<any>(`/api/market/historical/${symbol}?timeframe=1D`)
          ])
          
          if (!quoteRes.success || !histRes.success) {
            throw new Error('API returned success: false')
          }
          
          return {
            symbol,
            name: quoteRes.data?.name || symbol,
            type: 'Stock',
            quote: quoteRes.data,
            history: histRes.data
          } as FavoriteAssetData
        } catch (err) {
          return {
            symbol,
            name: symbol,
            type: 'Stock',
            quote: null,
            history: [],
            error: true
          } as any
        }
      })
      
      favoritesData.value = await Promise.all(promises)
    } catch (e: any) {
      console.warn('Failed to fetch favorites data:', e.message)
    } finally {
      loadingFavorites.value = false
    }
  }

  const searchAssets = async (query: string = '') => {
    loading.value = true
    errorMsg.value = ''

    try {
      const response = await $fetch<{ success: boolean; data: MarketSearchResult[] }>(
        `/api/market/search?query=${encodeURIComponent(query)}`
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

  const fetchAssetDetails = async (symbol: string, timeframe: string = '1D', nameOverride?: string) => {
    loadingDetails.value = true
    try {
      const [quoteRes, histRes] = await Promise.all([
        $fetch<any>(`/api/market/quotes/${symbol}`),
        $fetch<any>(`/api/market/historical/${symbol}?timeframe=${timeframe}`)
      ])
      
      if (!quoteRes.success || !histRes.success) {
        throw new Error('API returned success: false')
      }
      
      selectedAsset.value = quoteRes.data
      if (nameOverride && selectedAsset.value) {
        selectedAsset.value.name = nameOverride
      }
      historicalData.value = histRes.data
    } catch (e: any) {
      console.warn('Failed to fetch details:', e.message)
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
