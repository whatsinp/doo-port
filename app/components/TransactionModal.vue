<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      @click.self="closeModal"
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
          v-if="modelValue"
          class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i class="pi pi-wallet" :class="txType === 'BUY' ? 'text-green-500' : 'text-red-500'"/> บันทึกธุรกรรม
            </h2>
            <button 
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              @click="closeModal"
            >
              <i class="pi pi-times"/>
            </button>
          </div>

          <!-- Modal Body -->
          <form class="p-6" @submit.prevent="handleTransaction">
            
            <!-- Transaction Type Tabs -->
            <div class="flex p-1 mb-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <button 
                type="button" 
                class="flex-1 py-2 text-sm font-bold rounded-md transition-all" 
                :class="txType === 'BUY' ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
                @click="txType = 'BUY'"
              >
                ซื้อ
              </button>
              <button 
                type="button" 
                class="flex-1 py-2 text-sm font-bold rounded-md transition-all" 
                :class="txType === 'SELL' ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
                @click="txType = 'SELL'"
              >
                ขาย
              </button>
            </div>

            <div class="space-y-5">
              <!-- Portfolio Selection (Only shown if portfolioId is not provided) -->
              <div v-if="!fixedPortfolioId">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  พอร์ตการลงทุน
                </label>
                <div ref="dropdownRef" class="relative">
                  <button 
                    type="button" 
                    class="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center transition-all" 
                    @click="showDropdown = !showDropdown"
                  >
                    <span :class="!selectedPortfolioId ? 'text-gray-400 dark:text-gray-500' : ''">
                      {{ selectedPortfolioName || '-- เลือกพอร์ตการลงทุน --' }}
                    </span>
                    <i class="pi pi-chevron-down text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showDropdown }"/>
                  </button>
                  
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <div 
                      v-if="showDropdown" 
                      class="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-2"
                    >
                      <div 
                        v-for="p in portfolios" 
                        :key="p.id" 
                        class="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
                        :class="selectedPortfolioId === p.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300 font-medium'"
                        @click="selectPortfolio(p.id)"
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                            {{ p.name.substring(0, 1) }}
                          </div>
                          {{ p.name }}
                        </div>
                        <i v-if="selectedPortfolioId === p.id" class="pi pi-check"/>
                      </div>
                    </div>
                  </Transition>
                </div>
                <div v-if="portfolios.length === 0" class="mt-2 text-sm text-amber-500">
                  <i class="pi pi-info-circle"/> คุณยังไม่มีพอร์ตการลงทุน กรุณาสร้างพอร์ตก่อนทำธุรกรรม
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อย่อสินทรัพย์
                </label>
                <input
                  v-model="txForm.symbol"
                  type="text"
                  required
                  :readonly="!!defaultSymbol"
                  :class="defaultSymbol ? 'opacity-70 cursor-not-allowed' : ''"
                  placeholder="e.g. AAPL, NVDA, BTC"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 uppercase font-mono"
                >
              </div>
              
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    จำนวน
                  </label>
                  <input
                    v-model.number="txForm.quantity"
                    type="number"
                    step="any"
                    min="0.000001"
                    required
                    placeholder="0.00"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-mono"
                  >
                </div>
                <div class="flex-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ราคาต่อหน่วย
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{{ txForm.symbol.startsWith('THAIGOLD') ? '฿' : '$' }}</span>
                    <input
                      v-model.number="txForm.price"
                      type="number"
                      step="any"
                      min="0.01"
                      required
                      placeholder="0.00"
                      class="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-mono"
                    >
                  </div>
                </div>
              </div>
            </div>

            <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
              <i class="pi pi-exclamation-triangle"/> {{ errorMsg }}
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 mt-8">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors"
                @click="closeModal"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="processing || (!fixedPortfolioId && !selectedPortfolioId)"
                :class="txType === 'BUY' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-green-500/20' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-500/20'"
                class="px-5 py-2.5 rounded-xl font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
              >
                <i v-if="processing" class="pi pi-spinner pi-spin"/>
                <span>{{ processing ? 'กำลังดำเนินการ...' : (txType === 'BUY' ? 'ยืนยันการซื้อ' : 'ยืนยันการขาย') }}</span>
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useLedger } from '~/features/transactions/composables/useLedger'
import { usePortfolios } from '~/features/portfolio/composables/usePortfolios'

const props = defineProps<{
  modelValue: boolean
  fixedPortfolioId?: string // Optional, if omitted, dropdown is shown
  defaultSymbol?: string
  defaultPrice?: number
  defaultType?: 'BUY' | 'SELL'
}>()

const emit = defineEmits(['update:modelValue', 'transaction-success'])

const { portfolios } = usePortfolios()
const ledger = useLedger()

const showModal = ref(false)
const txType = ref<'BUY' | 'SELL'>('BUY')
const processing = ref(false)
const errorMsg = ref('')

const selectedPortfolioId = ref('')
const showDropdown = ref(false)
const dropdownRef = ref(null)

onClickOutside(dropdownRef, () => {
  showDropdown.value = false
})

const selectedPortfolioName = computed(() => {
  if (!selectedPortfolioId.value) return ''
  return portfolios.value.find(p => p.id === selectedPortfolioId.value)?.name || ''
})

const selectPortfolio = (id: string) => {
  selectedPortfolioId.value = id
  showDropdown.value = false
}

const txForm = ref({
  symbol: '',
  quantity: null as number | null,
  price: null as number | null
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    txType.value = props.defaultType || 'BUY'
    txForm.value.symbol = props.defaultSymbol || ''
    txForm.value.quantity = null
    txForm.value.price = props.defaultPrice || null
    errorMsg.value = ''
    selectedPortfolioId.value = props.fixedPortfolioId || ''
  }
})

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleTransaction = async () => {
  const targetPortfolio = props.fixedPortfolioId || selectedPortfolioId.value
  
  if (!targetPortfolio) {
    errorMsg.value = 'กรุณาเลือกพอร์ตการลงทุน'
    return
  }
  
  if (!txForm.value.symbol || !txForm.value.quantity || !txForm.value.price) {
    errorMsg.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
    return
  }
  
  processing.value = true
  errorMsg.value = ''
  
  try {
    if (txType.value === 'BUY') {
      await ledger.processBuy(
        targetPortfolio,
        txForm.value.symbol,
        txForm.value.quantity,
        txForm.value.price
      )
    } else {
      await ledger.processSell(
        targetPortfolio,
        txForm.value.symbol,
        txForm.value.quantity,
        txForm.value.price
      )
    }
    emit('transaction-success')
    closeModal()
  } catch (error: any) {
    console.error('ledger transaction FAILED:', error)
    errorMsg.value = error.data?.message || error.message || 'การทำธุรกรรมล้มเหลว'
  } finally {
    processing.value = false
  }
}
</script>
