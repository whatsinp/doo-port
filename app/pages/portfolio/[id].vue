<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink href="/portfolio">
          <Button icon="pi pi-arrow-left" text rounded severity="secondary" />
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Holdings</h1>
      </div>
      <div class="flex space-x-2">
        <Button
          label="Buy Asset"
          icon="pi pi-plus"
          severity="success"
          @click="showBuyDialog = true"
        />
      </div>
    </div>

    <!-- Holdings Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <DataTable
        :value="holdings"
        :loading="loading"
        responsiveLayout="scroll"
        class="p-datatable-sm"
      >
        <template #empty>
          <div class="p-8 text-center text-gray-500">
            No assets found in this portfolio. Click "Buy Asset" to add some!
          </div>
        </template>
        <Column
          field="assetSymbol"
          header="Symbol"
          class="font-bold text-gray-900 dark:text-white"
        ></Column>
        <Column field="quantity" header="Quantity" class="text-right"></Column>
        <Column field="averageCost" header="Avg. Cost" class="text-right">
          <template #body="{ data }">
            {{ formatCurrency(data.averageCost, data.tradeCurrency) }}
          </template>
        </Column>
        <Column field="costBasis" header="Total Cost Basis" class="text-right font-medium">
          <template #body="{ data }">
            {{ formatCurrency(data.costBasis, data.tradeCurrency) }}
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Custom Buy Dialog -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showBuyDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        @click.self="showBuyDialog = false"
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
            v-if="showBuyDialog"
            class="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i class="pi pi-shopping-cart text-green-500"></i> Record Buy Transaction
              </h2>
              <button 
                @click="showBuyDialog = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handleBuy" class="p-6">
              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Asset Symbol
                  </label>
                  <input
                    v-model="buyForm.symbol"
                    type="text"
                    required
                    placeholder="e.g. AAPL, NVDA, BTC"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 uppercase font-mono"
                  />
                </div>
                
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantity
                    </label>
                    <input
                      v-model.number="buyForm.quantity"
                      type="number"
                      step="any"
                      min="0.000001"
                      required
                      placeholder="0.00"
                      class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-mono"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit Price
                    </label>
                    <div class="relative">
                      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        v-model.number="buyForm.price"
                        type="number"
                        step="any"
                        min="0.01"
                        required
                        placeholder="0.00"
                        class="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                <i class="pi pi-exclamation-triangle"></i> {{ errorMsg }}
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  @click="showBuyDialog = false"
                  class="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="processing || !buyForm.symbol || !buyForm.quantity || !buyForm.price"
                  class="px-5 py-2.5 rounded-xl font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-green-500/20 flex items-center gap-2"
                >
                  <i v-if="processing" class="pi pi-spinner pi-spin"></i>
                  <span>{{ processing ? 'Processing...' : 'Confirm Buy' }}</span>
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHoldings } from '~/features/portfolio/composables/useHoldings'
import { useLedger } from '~/features/transactions/composables/useLedger'

const route = useRoute()
const portfolioId = route.params.id as string

const { holdings, loading } = useHoldings(portfolioId)
const ledger = useLedger()

const showBuyDialog = ref(false)
const processing = ref(false)
const errorMsg = ref('')

const buyForm = ref({
  symbol: '',
  quantity: null as number | null,
  price: null as number | null
})

const handleBuy = async () => {
  if (!buyForm.value.symbol || !buyForm.value.quantity || !buyForm.value.price) return
  processing.value = true
  errorMsg.value = ''
  try {
    await ledger.processBuy(
      portfolioId,
      buyForm.value.symbol,
      buyForm.value.quantity,
      buyForm.value.price
    )
    showBuyDialog.value = false
    buyForm.value = { symbol: '', quantity: null, price: null }
  } catch (error: any) {
    errorMsg.value = error.data?.message || error.message || 'Transaction failed'
  } finally {
    processing.value = false
  }
}

const formatCurrency = (val: string, currency: string) => {
  const num = parseFloat(val)
  if (isNaN(num)) return val
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(
    num
  )
}
</script>
