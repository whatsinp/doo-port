<template>
  <div class="w-full">
    <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">รายการที่คุณสนใจ</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">ติดตามหุ้นและสินทรัพย์ที่คุณชื่นชอบ</p>
      </div>
      <NuxtLink href="/market">
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">
          <i class="pi pi-chart-line"/>
          <span>ดูตลาดทั้งหมด</span>
        </button>
      </NuxtLink>
    </div>

    <!-- Search Box for Favorites -->
    <div class="mb-6">
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-4">
        <form class="flex flex-col gap-3" @submit.prevent="handleSearch">
          <div class="relative flex items-center">
            <i class="pi pi-search absolute left-4 text-gray-400 z-10"/>
            <input
v-model="searchQuery" type="text" placeholder="ค้นหาเพื่อเพิ่มรายการที่คุณสนใจ..."
              class="w-full pl-11 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              @input="handleInput" >
            <button
v-if="searchQuery" type="button"
              class="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              @click="clearSearch">
              <i class="pi pi-times"/>
            </button>
          </div>
        </form>
        <Message v-if="errorMsg" severity="error" class="mt-3">{{ errorMsg }}</Message>
      </div>

      <!-- Search Results -->
      <div
v-if="searchQuery"
        class="mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-xl max-h-[400px] flex flex-col">
        <div
          class="p-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/20 shrink-0">
          <h3 class="font-bold text-gray-900 dark:text-white">ผลการค้นหา</h3>
        </div>
        <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div v-if="loadingSearch" class="p-8 flex justify-center">
            <i class="pi pi-spinner pi-spin text-3xl text-blue-500"/>
          </div>
          <div v-else-if="results.length === 0" class="p-12 text-center text-gray-500 dark:text-gray-400">
            <i class="pi pi-search text-4xl mb-3 text-gray-300 dark:text-gray-600"/>
            <p>ไม่พบสินทรัพย์</p>
          </div>
          <div v-else class="flex flex-col">
            <div
v-for="asset in results" :key="asset.symbol"
              class="px-4 py-3 border-b border-gray-50 dark:border-gray-700/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-between">
              <div class="flex-1">
                <div class="font-bold text-gray-900 dark:text-white">{{ asset.symbol }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  {{ asset.name }}
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-semibold uppercase">
                  {{ asset.type }}
                </span>
                <button
class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  @click.stop="toggleMarketFavorite(asset.symbol)">
                  <i
class="pi text-lg transition-colors" :class="isMarketFavorite(asset.symbol)
                    ? 'pi-star-fill text-yellow-400'
                    : 'pi-star text-gray-300 dark:text-gray-600'
                    "/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading || loadingMarketData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
v-for="i in 6" :key="i"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden flex flex-col animate-pulse">
        <div
          class="p-6 border-b border-gray-50 dark:border-gray-700/30 flex justify-between items-start bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700"/>
            <div>
              <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"/>
              <div class="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded"/>
            </div>
          </div>
          <div class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700"/>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div class="flex justify-between items-end mb-6">
            <div>
              <div class="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"/>
              <div class="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"/>
            </div>
            <div class="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"/>
          </div>
          <div class="h-16 w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl mt-4"/>
        </div>
      </div>
    </div>

    <div
v-else-if="favorites.length === 0"
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-16 text-center rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
      <div
        class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 mb-6">
        <i class="pi pi-star text-5xl"/>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">รายการที่สนใจของคุณว่างเปล่า</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        ค้นหาสินทรัพย์ในตลาดและทำเครื่องหมายดาวเพื่อติดตามที่นี่
      </p>
      <NuxtLink href="/market">
        <button
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto">
          <i class="pi pi-search"/>
          ค้นหาสินทรัพย์เลย
        </button>
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
v-for="asset in enrichedFavorites" :key="asset.symbol"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col cursor-pointer"
        @click="goToMarket(asset.symbol)">
        <!-- Header -->
        <div
          class="p-6 border-b border-gray-50 dark:border-gray-700/30 flex justify-between items-start bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-800/50">
          <div class="flex items-center gap-4">
            <AssetLogo :symbol="asset.symbol" class="w-12 h-12 rounded-2xl text-xl" />
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">{{ asset.symbol }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ asset.name }}</p>
            </div>
          </div>
          <button
class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group"
            title="ลบออกจากรายการที่คุณสนใจ"
            @click.stop="removeFavorite(asset.symbol, asset.name)">
            <i class="pi pi-star-fill text-yellow-400 text-xl group-hover:scale-110 transition-transform"/>
          </button>
        </div>

        <!-- Price Data & Sparkline -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div v-if="asset.quote" class="flex justify-between items-end mb-6">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ราคาปัจจุบัน</p>
              <div class="text-2xl font-extrabold text-gray-900 dark:text-white">
                {{ asset.quote.currency === 'THB' ? '฿' : '$' }}{{ Number(asset.quote.price).toLocaleString('en-US', {
                  minimumFractionDigits: 2, maximumFractionDigits: 6 }) }}
              </div>
            </div>
            <div class="text-right">
              <div
class="inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg text-sm"
                :class="asset.quote.changePercent >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'">
                <i :class="asset.quote.changePercent >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"/>
                {{ Math.abs(asset.quote.changePercent) }}%
              </div>
            </div>
          </div>
          <div v-else-if="asset.error" class="py-4 text-center text-sm text-rose-500 font-medium">
            <i class="pi pi-exclamation-triangle mr-2"/> ไม่สามารถดาวน์โหลดข้อมูลได้
          </div>
          <div v-else class="py-4 text-center text-sm text-gray-500">
            <i class="pi pi-spinner pi-spin mr-2"/> กำลังโหลดข้อมูล...
          </div>

          <div v-if="asset.history && asset.history.length > 0" class="h-16 w-full">
            <SparklineChart
:data="asset.history"
              :color="asset.quote && asset.quote.changePercent >= 0 ? '#10b981' : '#f43f5e'" />
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
import { useMarket } from '~/features/market/composables/useMarket'
import SparklineChart from '~/components/SparklineChart.vue'

const router = useRouter()
const { favorites, loading, toggleFavorite } = useFavorites()
const { searchAssets, results, loading: loadingSearch, errorMsg, toggleFavorite: toggleMarketFavorite, isFavorite: isMarketFavorite } = useMarket()

const config = useRuntimeConfig()

// Search logic
const searchQuery = ref('')
let searchTimeout: any = null

const handleInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value) {
      searchAssets(searchQuery.value)
    }
  }, 300)
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value) {
    searchAssets(searchQuery.value)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

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
        $fetch<any>(`/api/market/quotes/${fav.symbol}`),
        $fetch<any>(`/api/market/historical/${fav.symbol}?timeframe=1D`)
      ])

      if (!quoteRes.success || !histRes.success) {
        throw new Error('API returned success: false')
      }

      results.push({
        ...fav,
        quote: quoteRes.data,
        history: histRes.data
      })
    } catch (e) {
      console.warn(`Failed to fetch data for ${fav.symbol}`)
      results.push({
        ...fav,
        quote: existing?.quote || null,
        history: existing?.history || [],
        error: true
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
  router.push({ path: '/market', query: { symbol } })
}
</script>
