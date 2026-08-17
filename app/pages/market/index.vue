<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">ตลาด</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          ค้นพบและวิเคราะห์หุ้น, คริปโต, และสินทรัพย์อื่นๆ
        </p>
      </div>
      <NuxtLink href="/portfolio">
        <Button label="จัดการพอร์ตการลงทุน" icon="pi pi-briefcase" />
      </NuxtLink>
    </div>

    <!-- Layout: Grid for List (Left) and Details (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Search & List -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <!-- Search Box -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-4"
        >
          <form @submit.prevent="handleSearch" class="flex flex-col gap-3">
            <div class="relative flex items-center">
              <i class="pi pi-search absolute left-4 text-gray-400 z-10"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="ค้นหาชื่อย่อหรือชื่อ..."
                class="w-full pl-11 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                @input="handleInput"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="clearSearch"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </form>
          <Message v-if="errorMsg" severity="error" class="mt-3">{{ errorMsg }}</Message>
        </div>

        <!-- Search Results / Favorites List -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden flex-1 flex flex-col shadow-xl max-h-[567px]"
        >
          <div
            class="p-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/20 shrink-0"
          >
            <h3 class="font-bold text-gray-900 dark:text-white">
              {{ searchQuery ? 'ผลการค้นหา' : 'หุ้นที่ชอบ' }}
            </h3>
          </div>

          <div class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <div v-if="loading || loadingFavorites" class="p-8 flex justify-center">
              <i class="pi pi-spinner pi-spin text-3xl text-blue-500"></i>
            </div>

            <!-- Empty State for Favorites -->
            <div
              v-else-if="!searchQuery && favoritesData.length === 0"
              class="p-12 text-center text-gray-500 dark:text-gray-400"
            >
              <i class="pi pi-star text-4xl mb-3 text-gray-300 dark:text-gray-600"></i>
              <p>คุณยังไม่ได้เพิ่มหุ้นที่ชอบ</p>
              <p class="text-sm mt-2">ค้นหาสินทรัพย์และคลิกที่ดาวเพื่อบันทึกไว้ที่นี่</p>
            </div>

            <!-- Empty State for Search -->
            <div
              v-else-if="searchQuery && results.length === 0"
              class="p-12 text-center text-gray-500 dark:text-gray-400"
            >
              <i class="pi pi-search text-4xl mb-3 text-gray-300 dark:text-gray-600"></i>
              <p>ไม่พบสินทรัพย์</p>
            </div>

            <!-- List View -->
            <div v-else class="flex flex-col">
              <!-- Search Results Mode -->
              <template v-if="searchQuery">
                <div
                  v-for="asset in results"
                  :key="asset.symbol"
                  class="px-4 py-3 border-b border-gray-50 dark:border-gray-700/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-between"
                  :class="
                    selectedAsset?.symbol === asset.symbol
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500'
                      : 'border-l-4 border-l-transparent'
                  "
                >
                  <div class="flex-1 cursor-pointer" @click="onRowClick(asset.symbol, asset.name)">
                    <div class="font-bold text-gray-900 dark:text-white">{{ asset.symbol.length > 10 ? asset.symbol.substring(0, 10) + '...' : asset.symbol }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {{ asset.name }}
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span
                      class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-semibold uppercase"
                    >
                      {{ asset.type }}
                    </span>
                    <button
                      @click.stop="toggleFavorite(asset.symbol)"
                      class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <i
                        class="pi text-lg transition-colors"
                        :class="
                          isFavorite(asset.symbol)
                            ? 'pi-star-fill text-yellow-400'
                            : 'pi-star text-gray-300 dark:text-gray-600'
                        "
                      ></i>
                    </button>
                  </div>
                </div>
              </template>

              <!-- Favorites Mode -->
              <template v-else>
                <div
                  v-for="asset in favoritesData"
                  :id="'asset-row-' + asset.symbol"
                  :key="asset.symbol"
                  class="px-4 py-3 border-b border-gray-50 dark:border-gray-700/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-between gap-4"
                  :class="
                    selectedAsset?.symbol === asset.symbol
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500'
                      : 'border-l-4 border-l-transparent'
                  "
                >
                  <!-- Symbol & Name -->
                  <div class="w-1/3 cursor-pointer" @click="onRowClick(asset.symbol, asset.name)">
                    <div class="font-bold text-gray-900 dark:text-white">{{ asset.symbol.length > 10 ? asset.symbol.substring(0, 10) + '...' : asset.symbol }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {{ asset.name }}
                    </div>
                  </div>

                  <!-- Sparkline Chart -->
                  <div class="w-1/3 h-10 cursor-pointer" @click="onRowClick(asset.symbol, asset.name)">
                    <template v-if="!asset.error && asset.quote">
                      <SparklineChart
                        v-if="asset.history && asset.history.length > 0"
                        :data="asset.history"
                        :color="asset.quote.changePercent >= 0 ? '#10b981' : '#f43f5e'"
                      />
                    </template>
                  </div>

                  <!-- Price & Action -->
                  <div class="w-1/3 flex items-center justify-end gap-3">
                    <div
                      class="flex flex-col items-end cursor-pointer"
                      @click="onRowClick(asset.symbol, asset.name)"
                    >
                      <template v-if="!asset.error && asset.quote">
                        <div class="font-bold text-gray-900 dark:text-white text-sm">
                          {{ asset.quote.currency === 'THB' ? '฿' : '$' }}{{ asset.quote.price }}
                        </div>
                        <div
                          class="text-xs font-semibold"
                          :class="
                            asset.quote.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'
                          "
                        >
                          {{ asset.quote.changePercent >= 0 ? '+' : ''
                          }}{{ asset.quote.changePercent }}%
                        </div>
                      </template>
                      <template v-else>
                        <div class="text-xs text-rose-500 flex items-center gap-1">
                          <i class="pi pi-exclamation-triangle"></i>
                          <span>โหลดไม่สำเร็จ</span>
                        </div>
                      </template>
                    </div>
                    <button
                      @click.stop="toggleFavoriteAndRefresh(asset.symbol)"
                      class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0"
                    >
                      <i
                        class="pi text-lg transition-colors"
                        :class="
                          isFavorite(asset.symbol)
                            ? 'pi-star-fill text-yellow-400'
                            : 'pi-star text-gray-300 dark:text-gray-600'
                        "
                      ></i>
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Asset Detail Pane -->
      <div class="lg:col-span-7">
        <div
          v-if="!selectedAsset"
          class="h-full min-h-[400px] bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500"
        >
          <i class="pi pi-chart-line text-6xl mb-4 opacity-50"></i>
          <p class="text-lg">เลือกสินทรัพย์จากรายการเพื่อดูรายละเอียด</p>
        </div>

        <Transition
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-300 ease-in absolute w-full"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-8"
        >
          <div
            v-if="selectedAsset"
            class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          >
            <!-- Header & Price Info -->
            <div
              class="p-6 lg:p-8 border-b border-gray-100 dark:border-gray-700/50 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-gray-900/20"
            >
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <!-- Left: Name and Price -->
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <AssetLogo :symbol="selectedAsset.symbol" class="w-16 h-16 rounded-2xl text-3xl" />
                    <div>
                      <div class="flex items-center gap-3">
                        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white" :title="selectedAsset.symbol">
                          {{ selectedAsset.symbol.length > 10 ? selectedAsset.symbol.substring(0, 10) + '...' : selectedAsset.symbol }}
                        </h2>
                        <button
                          @click.stop="toggleFavoriteAndRefresh(selectedAsset.symbol)"
                          class="p-2 -ml-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full transition-colors"
                        >
                          <i
                            class="pi text-2xl transition-colors"
                            :class="
                              isFavorite(selectedAsset.symbol)
                                ? 'pi-star-fill text-yellow-400 drop-shadow-sm'
                                : 'pi-star text-gray-300 dark:text-gray-600'
                            "
                          ></i>
                        </button>
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 font-medium">
                        {{ selectedAsset.name }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-6 flex items-baseline gap-3">
                    <span class="text-4xl font-bold text-gray-900 dark:text-white">
                      {{ selectedAsset.currency === 'THB' ? '฿' : '$' }}{{ selectedAsset.price }}
                    </span>
                    <span v-if="selectedAsset.currency !== 'THB'" class="text-lg text-gray-500 dark:text-gray-400 font-medium">
                      ≈ ฿{{ (parseFloat(selectedAsset.price) * (exchangeRateTHB || 33.07)).toFixed(2) }}
                    </span>
                  </div>

                  <div class="mt-2 flex items-center gap-2">
                    <div
                      class="flex items-center gap-1 font-bold px-3 py-1 rounded-full text-sm"
                      :class="
                        selectedAsset.changePercent >= 0
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      "
                    >
                      <i
                        :class="
                          selectedAsset.changePercent >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
                        "
                      ></i>
                      {{ Math.abs(selectedAsset.changePercent) }}% วันนี้
                    </div>
                    <span class="text-xs text-gray-400">
                      อัปเดตล่าสุด: {{ new Date(selectedAsset.asOf).toLocaleTimeString() }}
                    </span>
                  </div>
                </div>

                <!-- Right: Actions and Meta stats -->
                <div class="flex flex-col gap-4 items-end">
                  <!-- Action Buttons -->
                  <div class="flex gap-3">
                    <button
                      @click="openTransactionDialog('BUY')"
                      class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center gap-2"
                    >
                      <i class="pi pi-arrow-down-left"></i> ซื้อเข้าพอร์ต
                    </button>
                    <button
                      @click="openTransactionDialog('SELL')"
                      class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                    >
                      <i class="pi pi-arrow-up-right"></i> ขายออก
                    </button>
                  </div>

                  <!-- Meta stats -->
                  <div
                    class="flex gap-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 mt-auto"
                  >
                    <div class="flex flex-col">
                      <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">สูงสุดของวัน</span>
                      <span class="font-bold text-gray-900 dark:text-white"
                        >{{ selectedAsset.currency === 'THB' ? '฿' : '$' }}{{ selectedAsset.dayHigh }}</span
                      >
                    </div>
                    <div class="w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div class="flex flex-col">
                      <span class="text-sm text-gray-500 dark:text-gray-400 mb-1">ต่ำสุดของวัน</span>
                      <span class="font-bold text-gray-900 dark:text-white"
                        >{{ selectedAsset.currency === 'THB' ? '฿' : '$' }}{{ selectedAsset.dayLow }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart Section -->
            <div class="p-6 lg:p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-baseline gap-3">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">ประวัติราคา</h3>
                  <div v-if="selectedAsset" class="flex items-center gap-1 text-sm font-semibold" :class="historicalChangePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                    <i :class="historicalChangePercent >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
                    <span>{{ Math.abs(historicalChangePercent).toFixed(2) }}%</span>
                    <span class="text-gray-500 dark:text-gray-400 font-medium ml-1">{{ historicalChangeText }}</span>
                  </div>
                </div>
                <div class="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                  <button
                    v-for="tf in ['1D', '5D', '1M', '6M', '1Y']"
                    :key="tf"
                    @click="setTimeframe(tf)"
                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                    :class="
                      activeTimeframe === tf
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    "
                  >
                    {{ tf }}
                  </button>
                </div>
              </div>

              <AssetChart :data="historicalData" :loading="loadingDetails" :color="chartColor" :currency="selectedAsset?.currency || 'USD'" />
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Transaction Modal -->
    <TransactionModal
      v-model="showTxDialog"
      :defaultSymbol="selectedAsset?.symbol"
      :defaultPrice="selectedAsset ? parseFloat(selectedAsset.price) : undefined"
      :defaultType="txType"
      @transaction-success="onTransactionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useMarket } from '~/features/market/composables/useMarket'
import AssetChart from '~/components/AssetChart.vue'
import SparklineChart from '~/components/SparklineChart.vue'
import TransactionModal from '~/components/TransactionModal.vue'
import { useExchangeRate } from '~/composables/useExchangeRate'

const searchQuery = ref('')
const activeTimeframe = ref('1D')
const route = useRoute()
const { exchangeRateTHB } = useExchangeRate()

const {
  searchAssets,
  fetchAssetDetails,
  results,
  loading,
  errorMsg,
  selectedAsset,
  historicalData,
  loadingDetails,
  favorites,
  favoritesData,
  loadingFavorites,
  toggleFavorite,
  isFavorite,
  fetchFavoritesData
} = useMarket()

const chartColor = computed(() => {
  if (activeTimeframe.value === '1D' && selectedAsset.value) {
    return selectedAsset.value.changePercent >= 0 ? '#10b981' : '#f43f5e'
  }
  if (!historicalData.value || historicalData.value.length === 0) return '#10b981'
  const firstPoint = historicalData.value[0].value
  const lastPoint = historicalData.value[historicalData.value.length - 1].value
  return lastPoint >= firstPoint ? '#10b981' : '#f43f5e'
})

const historicalChangePercent = computed(() => {
  if (activeTimeframe.value === '1D' && selectedAsset.value) {
    return selectedAsset.value.changePercent
  }
  if (!historicalData.value || historicalData.value.length === 0) return 0
  const firstPoint = historicalData.value[0].value
  const lastPoint = historicalData.value[historicalData.value.length - 1].value
  if (firstPoint === 0) return 0
  return ((lastPoint - firstPoint) / firstPoint) * 100
})

const historicalChangeText = computed(() => {
  if (activeTimeframe.value === '1D') return 'วันนี้'
  if (activeTimeframe.value === '5D') return '5 วันย้อนหลัง'
  if (activeTimeframe.value === '1M') return '1 เดือนย้อนหลัง'
  if (activeTimeframe.value === '6M') return '6 เดือนย้อนหลัง'
  if (activeTimeframe.value === '1Y') return '1 ปีย้อนหลัง'
  return ''
})

// Watch for favorites to populate from Firebase, then fetch market data
watch(
  favorites,
  async (newFavs) => {
    if (
      newFavs &&
      newFavs.length > 0 &&
      favoritesData.value.length === 0 &&
      !loadingFavorites.value &&
      !searchQuery.value
    ) {
      await fetchFavoritesData()
      // Auto-select the first favorite if none is selected
      if (favoritesData.value.length > 0 && !selectedAsset.value && !route.query.symbol) {
        onRowClick(favoritesData.value[0].symbol)
      }
    }
  },
  { immediate: true }
)

watch(
  favoritesData,
  () => {
    if (selectedAsset.value) {
      nextTick(() => {
        const el = document.getElementById('asset-row-' + selectedAsset.value.symbol)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  },
  { deep: true }
)

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
  // User cleared search, so we are back to favorites
  fetchFavoritesData()
}

const toggleFavoriteAndRefresh = async (symbol: string) => {
  await toggleFavorite(symbol)
  // We no longer need to manually fetchFavoritesData here because
  // toggleFavorite already optimistically updates favoritesData for removals,
  // and additions from search will be fetched when clearing the search.
}

const onRowClick = async (symbol: string, nameOverride?: string) => {
  activeTimeframe.value = '1D' // Reset timeframe
  await fetchAssetDetails(symbol, activeTimeframe.value, nameOverride)
  
  // Scroll the selected asset into view in the sidebar
  nextTick(() => {
    const el = document.getElementById('asset-row-' + symbol)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

onMounted(() => {
  if (route.query.symbol) {
    onRowClick(route.query.symbol as string)
  }
})

const setTimeframe = async (tf: string) => {
  if (!selectedAsset.value || activeTimeframe.value === tf) return
  activeTimeframe.value = tf
  await fetchAssetDetails(selectedAsset.value.symbol, tf)
}

// Transaction Modal Logic
const showTxDialog = ref(false)
const txType = ref<'BUY' | 'SELL'>('BUY')

const openTransactionDialog = (type: 'BUY' | 'SELL') => {
  txType.value = type
  showTxDialog.value = true
}

const onTransactionSuccess = () => {
  // Show toast or success message here if needed
}
</script>
