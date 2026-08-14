<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink href="/portfolio">
          <button class="p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center">
            <i class="pi pi-arrow-left text-lg"/>
          </button>
        </NuxtLink>
        <button
          v-if="portfolioId !== 'all'"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          @click="openTransactionDialog('BUY')"
        >
          <i class="pi pi-plus"/>
          <span>บันทึกธุรกรรม</span>
        </button>
      </div>
    </div>

    <!-- Portfolio Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ portfolioId === 'all' ? 'พอร์ตรวม' : portfolioDetails?.name || 'กำลังโหลด...' }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2 max-w-3xl">
        {{ portfolioId === 'all' ? 'รวบรวมธุรกรรมและการลงทุนทั้งหมดของคุณจากทุกพอร์ตไว้ในที่เดียว' : portfolioDetails?.description || '' }}
      </p>
    </div>

    <!-- Holdings Section -->
    <div v-if="loading" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"/>
    </div>
    
    <div v-else-if="activeHoldings.length === 0" class="bg-white dark:bg-gray-800 p-12 text-center rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <i class="pi pi-folder-open text-6xl text-gray-300 dark:text-gray-600 mb-4"/>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">ไม่พบสินทรัพย์</h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">คลิก "บันทึกธุรกรรม" เพื่อเพิ่มสินทรัพย์ในพอร์ตนี้!</p>
    </div>
    
    <div v-else class="flex flex-col gap-6">
      <!-- Portfolio Overview (Chart & Summary) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <!-- Left: Allocation Chart -->
          <div class="lg:col-span-7 xl:col-span-8 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700 pb-8 lg:pb-0 lg:pr-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 w-full text-left">สัดส่วนพอร์ตการลงทุน</h3>
            <div class="w-full h-[300px] relative flex justify-center">
              <Doughnut :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Right: Value & P/L Summary -->
          <div class="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            
            <!-- Current Value -->
            <div class="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all hover:shadow-md">

              <h2 class="text-gray-500 dark:text-gray-400 font-medium mb-1">มูลค่าสินทรัพย์รวม</h2>
              <div class="text-4xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm flex items-baseline gap-2">
                {{ formatCurrency(String(totalPortfolioValue), 'USD') }} <span class="text-xl font-bold text-gray-500">USD</span>
              </div>
              <div class="text-sm font-medium text-gray-400 mt-2">
                ≈ ฿{{ (totalPortfolioValue * 35).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} THB
              </div>
            </div>

            <!-- Profit / Loss -->
            <div class="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all hover:shadow-md">

              <h2 class="text-gray-500 dark:text-gray-400 font-medium mb-1">กำไร / ขาดทุน (P/L)</h2>
              <div class="text-4xl font-extrabold flex items-baseline gap-2 drop-shadow-sm" :class="totalProfitLoss >= 0 ? 'text-green-500' : 'text-rose-500'">
                {{ totalProfitLoss >= 0 ? '+' : '' }}{{ formatCurrency(String(totalProfitLoss), 'USD') }}
                <span class="text-xl font-bold" :class="totalProfitLoss >= 0 ? 'text-green-600/70' : 'text-rose-600/70'">USD</span>
              </div>
              <div class="flex items-center gap-3 mt-2">
                <div class="text-sm font-bold" :class="totalProfitLoss >= 0 ? 'text-green-500' : 'text-rose-500'">
                  <i :class="totalProfitLoss >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"/> 
                  {{ Number(totalProfitLossPercent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%
                </div>
                <div class="text-sm font-medium" :class="totalProfitLoss >= 0 ? 'text-green-500 dark:text-green-400' : 'text-rose-500 dark:text-rose-400'">
                  ≈ {{ totalProfitLoss >= 0 ? '+' : '' }}฿{{ (Math.abs(totalProfitLoss) * 35).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} THB
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Asset Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="holding in activeHoldings" 
          :key="holding.id"
          class="rounded-2xl p-6 text-white flex flex-col justify-between min-h-[160px] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative overflow-hidden group"
          :style="{ backgroundColor: getAssetColor(holding.assetSymbol) }"
          @click="openDetailsModal(holding)"
        >
          <!-- Background gradient overlay for depth -->
          <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300"/>
          

          
          <div class="relative z-10 flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <AssetLogo :symbol="holding.assetSymbol" class="w-14 h-14 rounded-full text-2xl" />
              <div>
                <h3 class="text-2xl font-bold tracking-tight leading-tight">{{ holding.assetSymbol }}</h3>
                <p class="text-sm text-white/80 font-medium truncate max-w-[150px]">{{ getAssetProfitLoss(holding).quote?.name || '' }}</p>
              </div>
            </div>
          </div>

          <div class="relative z-10 mt-auto">
            <div class="text-3xl font-extrabold mb-4 drop-shadow-sm flex items-baseline gap-2 flex-wrap">
              <template v-if="holding.assetSymbol.startsWith('THAIGOLD')">
                {{ formatCurrency(getAssetProfitLoss(holding).currentVal, 'THB') }}
              </template>
              <template v-else>
                {{ formatCurrency(getAssetProfitLoss(holding).currentVal, 'USD') }}
                <span class="text-lg font-medium opacity-90">
                  ≈ {{ formatCurrency(getAssetProfitLoss(holding).currentVal * 35, 'THB') }}
                </span>
              </template>
            </div>
            
            <div class="inline-flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm text-sm font-bold shadow-inner" :class="getAssetProfitLoss(holding).pl >= 0 ? 'text-green-300' : 'text-rose-300'">
              <i :class="getAssetProfitLoss(holding).pl >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"/>
              <template v-if="holding.assetSymbol.startsWith('THAIGOLD')">
                <span>% กำไรและมูลค่า: {{ Number(getAssetProfitLoss(holding).plPercent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% ({{ getAssetProfitLoss(holding).pl >= 0 ? '+' : '' }}{{ formatCurrency(getAssetProfitLoss(holding).pl, 'THB') }})</span>
              </template>
              <template v-else>
                <span>% กำไรและมูลค่า: {{ Number(getAssetProfitLoss(holding).plPercent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% ({{ getAssetProfitLoss(holding).pl >= 0 ? '+' : '' }}{{ formatCurrency(getAssetProfitLoss(holding).pl, 'USD') }} ≈ {{ getAssetProfitLoss(holding).pl >= 0 ? '+' : '' }}{{ formatCurrency(getAssetProfitLoss(holding).pl * 35, 'THB') }})</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TransactionModal
      v-model="showTxDialog"
      :fixed-portfolio-id="portfolioId"
      :default-symbol="txForm.symbol"
      :default-type="txType"
      @transaction-success="onTransactionSuccess"
    />

    <!-- Asset Details Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="selectedHoldingForDetails" 
          class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md"
          :style="{ background: `linear-gradient(135deg, rgba(255,255,255,0.7) 0%, ${getAssetColor(selectedHoldingForDetails.assetSymbol)}50 100%)` }"
          @click.self="closeDetailsModal"
        >
          <Transition
            appear
            enter-active-class="transition duration-300 ease-out delay-75 transform"
            enter-from-class="opacity-0 translate-y-8 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-200 ease-in transform"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-4 scale-95"
          >
            <!-- Dialog Container (Solid White) -->
            <div class="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
            <div class="p-8">
              <div class="flex justify-between items-start mb-8">
                <div class="flex items-center gap-4">
                  <AssetLogo :symbol="selectedHoldingForDetails.assetSymbol" class="w-16 h-16 rounded-2xl shadow-lg text-3xl text-white" />
                  <div>
                    <h2 class="text-3xl font-bold text-gray-900 tracking-tight">{{ selectedHoldingForDetails.assetSymbol }}</h2>
                    <p class="text-gray-600 font-medium line-clamp-1">{{ getAssetProfitLoss(selectedHoldingForDetails).quote?.name || 'Loading...' }}</p>
                  </div>
                </div>
                <button class="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-600 transition-colors" @click="closeDetailsModal">
                  <i class="pi pi-times text-lg"/>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p class="text-sm text-gray-500 font-bold mb-1">จำนวนหุ้นที่ถืออยู่</p>
                  <p class="text-2xl font-bold text-gray-900">{{ parseFloat(selectedHoldingForDetails.quantity).toLocaleString('en-US', { maximumFractionDigits: 4 }) }} หุ้น</p>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div class="flex flex-col">
                    <p class="text-sm text-gray-500 font-bold mb-1">ราคาปัจจุบัน <span class="text-xs font-normal">(& % เปลี่ยน 1 วัน)</span></p>
                    <div class="flex items-center gap-3">
                      <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(toTHB(selectedHoldingForDetails.assetSymbol, getAssetProfitLoss(selectedHoldingForDetails).price), 'THB') }}</p>
                      <div class="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-xs" :class="(getAssetProfitLoss(selectedHoldingForDetails).quote?.changePercent || 0) >= 0 ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'">
                        <i :class="(getAssetProfitLoss(selectedHoldingForDetails).quote?.changePercent || 0) >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-[10px]"/>
                        {{ Number(getAssetProfitLoss(selectedHoldingForDetails).quote?.changePercent || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p class="text-sm text-gray-500 font-bold mb-1">ต้นทุนต่อหุ้น</p>
                  <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(toTHB(selectedHoldingForDetails.assetSymbol, selectedHoldingForDetails.averageCost), 'THB') }}</p>
                </div>

                <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <p class="text-sm text-gray-500 font-bold mb-1">ต้นทุนรวม</p>
                  <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(toTHB(selectedHoldingForDetails.assetSymbol, selectedHoldingForDetails.costBasis), 'THB') }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="portfolioId !== 'all'" class="flex gap-4">
                <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2" @click="openTxFromDetails('BUY')">
                  <i class="pi pi-arrow-down-left"/> ซื้อเพิ่ม
                </button>
                <button class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2" @click="openTxFromDetails('SELL')">
                  <i class="pi pi-arrow-up-right"/> ขายออก
                </button>
              </div>
              <div v-if="portfolioId !== 'all'" class="mt-4">
                <button class="w-full bg-white/40 hover:bg-red-50 text-red-600 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-red-200/50 hover:border-red-300" @click="handleDeleteFromDetails">
                  <i class="pi pi-trash"/> ลบสินทรัพย์นี้
                </button>
              </div>

            </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import TransactionModal from '~/components/TransactionModal.vue'
import { useRoute } from 'vue-router'
import { useHoldings } from '~/features/portfolio/composables/useHoldings'
import { usePortfolios } from '~/features/portfolio/composables/usePortfolios'
import { useLedger } from '~/features/transactions/composables/useLedger'

ChartJS.register(ArcElement, Tooltip, Legend)

const colorPalette = [
  '#60a5fa', // Soft Blue
  '#34d399', // Soft Green
  '#fb923c', // Soft Orange
  '#f87171', // Soft Red
  '#a78bfa', // Soft Purple
  '#f472b6', // Soft Pink
  '#2dd4bf', // Soft Teal
  '#fbbf24', // Soft Amber
  '#818cf8', // Soft Indigo
  '#38bdf8'  // Soft Sky Blue
]

const getAssetColor = (symbol: string) => {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

const route = useRoute()
const portfolioId = route.params.id as string
const config = useRuntimeConfig()

const { portfolios } = usePortfolios()
const portfolioDetails = computed(() => portfolios.value.find(p => p.id === portfolioId))

const { holdings, loading } = useHoldings(portfolioId)
const ledger = useLedger()

const totalPortfolioValue = computed(() => {
  return activeHoldings.value.reduce((total, h) => {
    let price = currentQuotes.value[h.assetSymbol] ? parseFloat(currentQuotes.value[h.assetSymbol].price) : 0
    if (h.assetSymbol.startsWith('THAIGOLD')) price = price / 35
    return total + (parseFloat(h.quantity) * price)
  }, 0)
})

const totalCostBasis = computed(() => {
  return activeHoldings.value.reduce((total, h) => {
    let cost = parseFloat(h.costBasis) || 0
    if (h.assetSymbol.startsWith('THAIGOLD')) cost = cost / 35
    return total + cost
  }, 0)
})

const activeHoldings = computed(() => {
  return holdings.value.filter(h => parseFloat(String(h.quantity)) > 0)
})

// Interface for MarketQuote
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

// Price Fetching Logic
const currentQuotes = ref<Record<string, MarketQuote>>({})
const loadingPrices = ref(false)

watch(activeHoldings, async (newHoldings) => {
  if (newHoldings.length === 0) {
    currentQuotes.value = {}
    return
  }
  loadingPrices.value = true
  try {
    const promises = newHoldings.map(async (h) => {
      try {
        const res = await $fetch<any>(
          `/api/market/quotes/${h.assetSymbol}`
        )
        if (!res.success) throw new Error('API returned success: false')
        return { symbol: h.assetSymbol, quote: res.data }
      } catch {
        return { symbol: h.assetSymbol, quote: null }
      }
    })
    const results = await Promise.all(promises)
    const quotes: Record<string, MarketQuote> = {}
    for (const r of results) {
      if (r.quote && parseFloat(r.quote.price) > 0) quotes[r.symbol] = r.quote
    }
    currentQuotes.value = quotes
  } finally {
    loadingPrices.value = false
  }
}, { deep: true, immediate: true })

const totalProfitLoss = computed(() => {
  return totalPortfolioValue.value - totalCostBasis.value
})

const totalProfitLossPercent = computed(() => {
  if (totalCostBasis.value === 0) return 0
  return (totalProfitLoss.value / totalCostBasis.value) * 100
})

const getAssetProfitLoss = (holding: any) => {
  const qty = parseFloat(holding.quantity)
  const cost = parseFloat(holding.costBasis)
  const quote = currentQuotes.value[holding.assetSymbol]
  const price = quote?.price ? parseFloat(quote.price) : (qty > 0 ? cost / qty : 0)
  const currentVal = qty * price
  const pl = currentVal - cost
  const plPercent = cost > 0 ? (pl / cost) * 100 : 0
  return { pl, plPercent, price, currentVal, quote }
}

// Asset Details Modal Logic
const selectedHoldingForDetails = ref<any>(null)

const openDetailsModal = (holding: any) => {
  selectedHoldingForDetails.value = holding
}

const closeDetailsModal = () => {
  selectedHoldingForDetails.value = null
}

const openTxFromDetails = (type: 'BUY' | 'SELL') => {
  if (!selectedHoldingForDetails.value) return
  openTransactionDialog(type, selectedHoldingForDetails.value.assetSymbol)
  closeDetailsModal()
}

const handleDeleteFromDetails = async () => {
  if (!selectedHoldingForDetails.value) return
  await handleDeleteHolding(selectedHoldingForDetails.value.assetSymbol)
  closeDetailsModal()
}

const chartData = computed(() => {
  return {
    labels: activeHoldings.value.map(h => h.assetSymbol),
    datasets: [
      {
        backgroundColor: activeHoldings.value.map(h => getAssetColor(h.assetSymbol)),
        data: activeHoldings.value.map(h => {
          let val = parseFloat(h.costBasis)
          if (h.assetSymbol.startsWith('THAIGOLD')) val = val / 35
          return val
        }),
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#9ca3af',
        font: {
          family: 'Inter, system-ui, sans-serif'
        },
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.label || '';
          if (label) {
              label += ': ';
          }
          if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
          }
          return label;
        }
      }
    }
  }
}

const showTxDialog = ref(false)
const txType = ref<'BUY' | 'SELL'>('BUY')
const processing = ref(false)
const errorMsg = ref('')

const txForm = ref({
  symbol: '',
  quantity: null as number | null,
  price: null as number | null
})

const openTransactionDialog = (type: 'BUY' | 'SELL', symbol: string = '') => {
  txType.value = type
  txForm.value = { symbol, quantity: null, price: null }
  showTxDialog.value = true
}

const handleDeleteHolding = async (symbol: string) => {
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${symbol}? การกระทำนี้จะลบประวัติการทำธุรกรรมทั้งหมดและไม่สามารถกู้คืนได้`)) return
  try {
    await ledger.deleteHolding(portfolioId, symbol)
  } catch (error: any) {
    alert('ไม่สามารถลบสินทรัพย์ได้: ' + (error.data?.message || error.message))
  }
}

const onTransactionSuccess = () => {
  // Can add toast notification here later
}

const formatCurrency = (val: string | number, currency?: string) => {
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) return String(val)
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(
    num
  )
}

const toTHB = (symbol: string, value: number) => {
  if (symbol.startsWith('THAIGOLD')) return value
  return value * 35
}
</script>
