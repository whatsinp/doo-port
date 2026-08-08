<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">พอร์ตการลงทุน</h1>
        <p class="text-gray-500 dark:text-gray-400">จัดการพอร์ตการลงทุนของคุณ</p>
      </div>
      <button
        @click="openCreateDialog"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        <i class="pi pi-plus"></i>
        <span>สร้างพอร์ตใหม่</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading || loadingHoldings" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="portfolios.length === 0"
      class="bg-white dark:bg-gray-800 p-12 text-center rounded-xl shadow border border-gray-200 dark:border-gray-700"
    >
      <i class="pi pi-folder-open text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">ยังไม่มีพอร์ตการลงทุน</h3>
      <p class="mt-1 mb-20 text-gray-500 dark:text-gray-400">
        สร้างพอร์ตการลงทุนแรกของคุณเพื่อเริ่มต้นติดตามการลงทุน
      </p>
      <button
        @click="openCreateDialog"
        class="flex items-center justify-center gap-2 px-5 py-2.5 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
      >
        <i class="pi pi-plus"></i>
        <span>สร้างพอร์ตการลงทุน</span>
      </button>
    </div>

    <!-- Portfolio Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Virtual "All Portfolios" Card -->
      <NuxtLink href="/portfolio/all" class="block">
        <div
          class="h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-bold">พอร์ตรวม</h3>
              <i class="pi pi-globe text-2xl opacity-75"></i>
            </div>
            <p class="text-blue-100 text-sm mb-6">ดูภาพรวมการลงทุนทั้งหมดของคุณจากทุกพอร์ตในที่เดียว</p>
          </div>
          
          <div class="space-y-1">
            <div class="text-sm font-medium opacity-80 mb-1">มูลค่ารวมทั้งหมด</div>
            <div class="text-2xl font-bold drop-shadow-sm transition-colors" :class="allPortfoliosPL.isProfit ? 'text-green-300' : 'text-rose-300'">
              {{ formatCurrency(totalAllPortfoliosUSD, 'USD') }}
            </div>
            <div class="text-sm font-medium text-blue-100 flex items-center bg-black/10 w-fit px-2 py-1 rounded backdrop-blur-sm">
              <span class="mr-1 opacity-80">🇹🇭</span>
              ≈ {{ formatCurrency(totalAllPortfoliosTHB, 'THB') }}
            </div>
            <div class="text-sm font-bold flex items-center gap-1 mt-2" :class="allPortfoliosPL.isProfit ? 'text-green-300' : 'text-rose-300'">
               <i :class="allPortfoliosPL.isProfit ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
               P/L: {{ allPortfoliosPL.pl >= 0 ? '+' : '' }}{{ formatCurrency(String(allPortfoliosPL.pl), 'USD') }} ({{ allPortfoliosPL.plPercent.toFixed(2) }}%)
            </div>
            <div class="text-xs font-medium opacity-75 mt-3 pt-3 border-t border-white/20">
              รวมทั้งหมด {{ portfolios.length }} พอร์ต
            </div>
          </div>
        </div>
      </NuxtLink>

      <!-- Individual Portfolios -->
      <div
        v-for="p in portfolios"
        :key="p.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col justify-between"
      >
        <div>
          <div class="flex justify-between items-start mb-1">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 flex-1 pr-2">{{ p.name }}</h3>
            <div class="flex items-center gap-1 shrink-0">
              <button
                aria-label="Edit"
                @click="openEditDialog(p)"
                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors flex items-center justify-center"
              >
                <i class="pi pi-pencil text-sm"></i>
              </button>
              <button
                aria-label="Delete"
                @click="confirmDelete(p.id)"
                class="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors flex items-center justify-center"
              >
                <i class="pi pi-trash text-sm"></i>
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
            {{ p.description || 'ไม่มีคำอธิบาย' }}
          </p>
          
          <div class="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg mb-5 border border-gray-100 dark:border-gray-700">
             <div class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
               มูลค่าพอร์ต
               <i v-if="loadingPrices" class="pi pi-spin pi-spinner text-blue-500"></i>
             </div>
             <div class="text-lg font-bold transition-colors flex items-baseline gap-1 flex-wrap" :class="getPortfolioPL(p.id).isProfit ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'">
               {{ formatCurrency(getPortfolioValueUSD(p.id), 'USD') }}
               <span class="text-[13px] font-bold">
                 ({{ getPortfolioPL(p.id).pl >= 0 ? '+' : '' }}{{ formatCurrency(String(getPortfolioPL(p.id).pl), 'USD') }} ({{ getPortfolioPL(p.id).pl >= 0 ? '+' : '' }}{{ getPortfolioPL(p.id).plPercent.toFixed(2) }}%))
               </span>
             </div>
             <div class="text-xs font-medium text-gray-500 mt-0.5">
               ≈ {{ formatCurrency(getPortfolioValueUSD(p.id) * 35, 'THB') }}
             </div>
          </div>
        </div>
        
        <NuxtLink :href="`/portfolio/${p.id}`" class="block">
          <button
            class="w-full py-2.5 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium rounded-lg transition-colors"
          >
            ดูพอร์ต
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- Custom Create/Edit Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        @click.self="showDialog = false"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out delay-75"
          enter-from-class="opacity-0 translate-y-8 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-4 scale-95"
        >
          <div
            v-if="showDialog"
            class="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <!-- Modal Header -->
            <div
              class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50"
            >
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i :class="editMode ? 'pi pi-pencil text-blue-500' : 'pi pi-folder-plus text-blue-500'"></i> 
                {{ editMode ? 'แก้ไขพอร์ตการลงทุน' : 'สร้างพอร์ตการลงทุน' }}
              </h2>
              <button
                @click="showDialog = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handleSave" class="p-6">
              <div class="mb-5">
                <label
                  for="portfolioName"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  ชื่อพอร์ต
                </label>
                <input
                  id="portfolioName"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="เช่น กองทุนเกษียณ, พอร์ตคริปโต"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  autofocus
                />
              </div>

              <div class="mb-6">
                <label
                  for="portfolioDescription"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  คำอธิบาย (ไม่บังคับ)
                </label>
                <textarea
                  id="portfolioDescription"
                  v-model="form.description"
                  rows="3"
                  placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับพอร์ตนี้..."
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                ></textarea>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  @click="showDialog = false"
                  class="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  :disabled="saving || !form.name.trim()"
                  class="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <i v-if="saving" class="pi pi-spinner pi-spin"></i>
                  <span>{{ saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}</span>
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePortfolios, type Portfolio } from '~/features/portfolio/composables/usePortfolios'
import { useDashboard } from '~/features/dashboard/composables/useDashboard'

const { portfolios, loading, createPortfolio, updatePortfolio, deletePortfolio } = usePortfolios()
const { allHoldings, currentPrices, loadingPrices, currentTotalValue, loading: loadingHoldings } = useDashboard()

const showDialog = ref(false)
const editMode = ref(false)
const editingId = ref('')
const saving = ref(false)

const form = ref({
  name: '',
  description: ''
})

const openCreateDialog = () => {
  editMode.value = false
  editingId.value = ''
  form.value = { name: '', description: '' }
  showDialog.value = true
}

const openEditDialog = (portfolio: Portfolio) => {
  editMode.value = true
  editingId.value = portfolio.id
  form.value = { 
    name: portfolio.name, 
    description: portfolio.description || '' 
  }
  showDialog.value = true
}

const handleSave = async () => {
  if (!form.value.name.trim()) return
  saving.value = true
  try {
    if (editMode.value) {
      await updatePortfolio(editingId.value, form.value.name.trim(), form.value.description.trim())
    } else {
      await createPortfolio(form.value.name.trim(), form.value.description.trim())
    }
    showDialog.value = false
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

const confirmDelete = async (id: string) => {
  if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบพอร์ตนี้? การกระทำนี้ไม่สามารถกู้คืนได้และธุรกรรมทั้งหมดในพอร์ตจะถูกลบไปด้วย')) {
    await deletePortfolio(id)
  }
}

// Portfolio Value Calculations
const formatCurrency = (value: number | string, currency?: string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num || 0)
}

const getPortfolioValueUSD = (portfolioId: string) => {
  const portsHoldings = allHoldings.value.filter(h => h.portfolioId === portfolioId && parseFloat(h.quantity) > 0)
  if (Object.keys(currentPrices.value).length === 0) {
    return portsHoldings.reduce((total, h) => total + (parseFloat(h.costBasis) || 0), 0)
  }
  let total = 0
  for (const h of portsHoldings) {
    const qty = parseFloat(h.quantity)
    const cost = parseFloat(h.costBasis)
    const price = currentPrices.value[h.assetSymbol] || (qty > 0 ? cost / qty : 0)
    total += qty * price
  }
  return total
}

const getPortfolioCostUSD = (portfolioId: string) => {
  return allHoldings.value
    .filter(h => h.portfolioId === portfolioId && parseFloat(h.quantity) > 0)
    .reduce((total, h) => total + (parseFloat(h.costBasis) || 0), 0)
}

const getPortfolioPL = (portfolioId: string) => {
  const value = getPortfolioValueUSD(portfolioId)
  const cost = getPortfolioCostUSD(portfolioId)
  const pl = value - cost
  const plPercent = cost > 0 ? (pl / cost) * 100 : 0
  return { pl, plPercent, isProfit: pl >= 0 }
}

const totalAllPortfoliosUSD = computed(() => {
  if (Object.keys(currentPrices.value).length > 0) {
    return currentTotalValue.value
  }
  return allHoldings.value
    .filter(h => parseFloat(h.quantity) > 0)
    .reduce((total, h) => total + (parseFloat(h.costBasis) || 0), 0)
})

const totalAllPortfoliosCostUSD = computed(() => {
  return allHoldings.value
    .filter(h => parseFloat(h.quantity) > 0)
    .reduce((total, h) => total + (parseFloat(h.costBasis) || 0), 0)
})

const allPortfoliosPL = computed(() => {
  const value = totalAllPortfoliosUSD.value
  const cost = totalAllPortfoliosCostUSD.value
  const pl = value - cost
  const plPercent = cost > 0 ? (pl / cost) * 100 : 0
  return { pl, plPercent, isProfit: pl >= 0 }
})

const totalAllPortfoliosTHB = computed(() => {
  return totalAllPortfoliosUSD.value * 35 // Used 35 consistently for THB estimate
})
</script>
