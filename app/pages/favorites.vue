<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">รายการที่น่าสนใจ</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">ติดตามหุ้นและสินทรัพย์ที่คุณชื่นชอบ</p>
      </div>
      <NuxtLink href="/market">
        <button class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">
          <i class="pi pi-plus"></i>
          <span>เพิ่มรายการ</span>
        </button>
      </NuxtLink>
    </div>

    <div v-if="loading || loadingMarketData" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div
      v-else-if="favorites.length === 0"
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-16 text-center rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50"
    >
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 mb-6">
        <i class="pi pi-star text-5xl"></i>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">รายการที่น่าสนใจของคุณว่างเปล่า</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        ค้นหาสินทรัพย์ในตลาดและทำเครื่องหมายดาวเพื่อติดตามที่นี่
      </p>
      <NuxtLink href="/market">
        <button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto">
          <i class="pi pi-search"></i>
          ค้นหาสินทรัพย์เลย
        </button>
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="asset in enrichedFavorites"
        :key="asset.symbol"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col cursor-pointer"
        @click="goToMarket(asset.symbol)"
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-50 dark:border-gray-700/30 flex justify-between items-start bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div class="flex items-center gap-4">
            <div 
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm"
              :class="asset.symbol.includes('BTC') || asset.symbol.includes('ETH') ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'"
            >
              {{ asset.symbol.substring(0, 1) }}
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">{{ asset.symbol }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ asset.name }}</p>
            </div>
          </div>
          <button 
            @click.stop="removeFavorite(asset.symbol, asset.name)" 
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group"
            title="ลบออกจากรายการที่น่าสนใจ"
          >
            <i class="pi pi-star-fill text-yellow-400 text-xl group-hover:scale-110 transition-transform"></i>
          </button>
        </div>

        <!-- Price Data & Sparkline -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div v-if="asset.quote" class="flex justify-between items-end mb-6">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ราคาปัจจุบัน</p>
              <div class="text-2xl font-extrabold text-gray-900 dark:text-white">
                ${{ asset.quote.price }}
              </div>
            </div>
            <div class="text-right">
              <div 
                class="inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg text-sm"
                :class="asset.quote.changePercent >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'"
              >
                <i :class="asset.quote.changePercent >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
                {{ Math.abs(asset.quote.changePercent) }}%
              </div>
            </div>
          </div>
          <div v-else class="py-4 text-center text-sm text-gray-500">
            <i class="pi pi-spinner pi-spin mr-2"></i> กำลังโหลดข้อมูล...
          </div>

          <div class="h-16 w-full" v-if="asset.history && asset.history.length > 0">
            <SparklineChart 
              :data="asset.history" 
              :color="asset.quote && asset.quote.changePercent >= 0 ? '#10b981' : '#f43f5e'" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from '#app'
import { useFavorites } from '~/features/favorites/composables/useFavorites'
import SparklineChart from '~/components/SparklineChart.vue'

const router = useRouter()
const { favorites, loading, toggleFavorite } = useFavorites()
const config = useRuntimeConfig()

const loadingMarketData = ref(false)
const enrichedFavorites = ref<any[]>([])

const fetchMarketDataForFavorites = async () => {
  if (favorites.value.length === 0) {
    enrichedFavorites.value = []
    return
  }

  loadingMarketData.value = true
  const results = []

  for (const fav of favorites.value) {
    // preserve existing data to avoid flashing if already loaded
    const existing = enrichedFavorites.value.find(e => e.symbol === fav.symbol)
    
    try {
      const [quoteRes, histRes] = await Promise.all([
        $fetch<any>(`${config.public.apiBaseUrl}/market/quotes/${fav.symbol}`),
        $fetch<any>(`${config.public.apiBaseUrl}/market/historical/${fav.symbol}?timeframe=1D`)
      ])
      
      results.push({
        ...fav,
        quote: quoteRes.data,
        history: histRes.data
      })
    } catch (e) {
      console.error(`Failed to fetch data for ${fav.symbol}`, e)
      results.push({
        ...fav,
        quote: existing?.quote || null,
        history: existing?.history || []
      })
    }
  }

  enrichedFavorites.value = results
  loadingMarketData.value = false
}

watch(
  favorites,
  (newFavs, oldFavs) => {
    // Only re-fetch if length changed or initial load to avoid infinite loops/unnecessary fetches
    if (!oldFavs || newFavs.length !== oldFavs.length) {
      fetchMarketDataForFavorites()
    }
  },
  { immediate: true }
)

const removeFavorite = async (symbol: string, name: string) => {
  // Optimistically remove from enriched list
  enrichedFavorites.value = enrichedFavorites.value.filter(f => f.symbol !== symbol)
  await toggleFavorite(symbol, name)
}

const goToMarket = (symbol: string) => {
  router.push('/market')
}
</script>
