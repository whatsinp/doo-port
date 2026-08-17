<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">แผงควบคุม</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          สรุปภาพรวมและสถิติการลงทุนของคุณทั้งหมด
        </p>
      </div>
      <NuxtLink href="/portfolio">
        <Button label="จัดการพอร์ตการลงทุน" icon="pi pi-briefcase" />
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"/>
    </div>

    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Cost -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            ต้นทุนการลงทุนทั้งหมด
          </p>
          <div class="flex flex-col mt-1">
            <p class="text-3xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
              {{ formatCurrency(totalCostBasis) }} <span class="text-xl font-bold text-gray-500 dark:text-gray-400">USD</span>
            </p>
            <p class="text-sm font-medium text-gray-400 mt-1">
              ≈ ฿{{ (totalCostBasis * exchangeRateTHB).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} THB
            </p>
          </div>
        </div>

        <!-- Current Value -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">

          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">มูลค่าสินทรัพย์</p>
          <div class="flex flex-col mt-1">
            <p class="text-3xl font-bold text-gray-900 dark:text-white flex items-baseline gap-2">
              {{ formatCurrency(currentTotalValue) }} <span class="text-xl font-bold text-gray-500 dark:text-gray-400">USD</span>
            </p>
            <p class="text-sm font-medium text-gray-400 mt-1">
              ≈ ฿{{ (currentTotalValue * exchangeRateTHB).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} THB
            </p>
          </div>
          <div class="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <i class="pi pi-bolt text-yellow-500"/> อัปเดตราคาล่าสุด (Real-time)
          </div>
        </div>

        <!-- Total Return (P/L) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">

          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">กำไร / ขาดทุน (P/L)</p>
          <div class="flex flex-col mt-1">
            <p class="text-3xl font-bold flex items-baseline gap-2" :class="totalProfitLoss >= 0 ? 'text-green-500' : 'text-rose-500'">
              {{ totalProfitLoss >= 0 ? '+' : '' }}{{ formatCurrency(totalProfitLoss) }}
              <span class="text-xl font-bold" :class="totalProfitLoss >= 0 ? 'text-green-600/70' : 'text-rose-600/70'">USD</span>
            </p>
            <p class="text-sm font-medium mt-1" :class="totalProfitLoss >= 0 ? 'text-green-500 dark:text-green-400' : 'text-rose-500 dark:text-rose-400'">
              ≈ {{ totalProfitLoss >= 0 ? '+' : '' }}฿{{ (Math.abs(totalProfitLoss) * exchangeRateTHB).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} THB
            </p>
          </div>
          <div class="text-sm font-medium mt-1" :class="totalProfitLoss >= 0 ? 'text-green-500' : 'text-rose-500'">
            <i :class="totalProfitLoss >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"/> 
            {{ Number(totalProfitLossPercent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%
          </div>
        </div>
      </div>

      <!-- Main Layout: Chart & Asset List -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart -->
        <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
          <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white self-start">สัดส่วนการลงทุน (Asset Allocation)</h2>
          <div v-if="aggregatedHoldings.length === 0" class="flex-1 flex items-center justify-center text-gray-400">
            ไม่มีข้อมูลสินทรัพย์
          </div>
          <div v-else class="w-full h-[420px] relative flex justify-center mt-2">
            <Doughnut :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Asset List -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">รายการสินทรัพย์ที่ถือครอง</h2>
            <span class="text-sm text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full font-medium">{{ aggregatedHoldings.length }} รายการ</span>
          </div>
          <div v-if="aggregatedHoldings.length === 0" class="p-12 text-center text-gray-500">
            ยังไม่มีการบันทึกสินทรัพย์ใดๆ ในพอร์ตของคุณ
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3 font-semibold">สินทรัพย์</th>
                  <th scope="col" class="px-6 py-3 font-semibold text-right">จำนวน</th>
                  <th scope="col" class="px-6 py-3 font-semibold text-right">ต้นทุนรวม</th>
                  <th scope="col" class="px-6 py-3 font-semibold text-right">ต้นทุนเฉลี่ย</th>
                  <th scope="col" class="px-6 py-3 font-semibold text-right">ราคาปัจจุบัน</th>
                  <th scope="col" class="px-6 py-3 font-semibold text-right">มูลค่าสินทรัพย์</th>
                  <th scope="col" class="px-6 py-3 font-semibold text-right">P/L</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
                <tr v-for="h in sortedHoldings" :key="h.symbol" class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    <div class="flex items-center gap-3">
                      <AssetLogo :symbol="h.symbol" class="w-8 h-8 rounded-full" />
                      {{ h.symbol }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-300">
                    {{ Number(h.quantity).toLocaleString('en-US', { maximumFractionDigits: 6 }) }}
                  </td>
                  <td class="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-300">
                    {{ formatCurrency(toUSD(h.symbol, h.costBasis)) }}
                  </td>
                  <td class="px-6 py-4 text-right font-medium text-gray-600 dark:text-gray-300">
                    {{ formatCurrency(toUSD(h.symbol, h.costBasis / h.quantity)) }}
                  </td>
                  <td class="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                    <div v-if="loadingPrices"><i class="pi pi-spinner pi-spin text-gray-400"/></div>
                    <div v-else>{{ formatCurrency(toUSD(h.symbol, currentPrices[h.symbol] || (h.costBasis / h.quantity))) }}</div>
                  </td>
                  <td class="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                    <div v-if="loadingPrices"><i class="pi pi-spinner pi-spin text-gray-400"/></div>
                    <div v-else>{{ formatCurrency(toUSD(h.symbol, h.quantity * (currentPrices[h.symbol] || (h.costBasis / h.quantity)))) }}</div>
                  </td>
                  <td class="px-6 py-4 text-right font-bold" :class="getProfitLoss(h) >= 0 ? 'text-green-500' : 'text-rose-500'">
                    <div v-if="loadingPrices"><i class="pi pi-spinner pi-spin text-gray-400"/></div>
                    <div v-else>
                      {{ getProfitLoss(h) >= 0 ? '+' : '' }}{{ formatCurrency(toUSD(h.symbol, getProfitLoss(h))) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboard } from '~/features/dashboard/composables/useDashboard'
import { useProfile } from '~/features/profile/composables/useProfile'
import { useExchangeRate } from '~/composables/useExchangeRate'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const { aggregatedHoldings, loading, totalCostBasis, currentPrices, loadingPrices, currentTotalValue } = useDashboard()
const { profile } = useProfile()
const { exchangeRateTHB } = useExchangeRate()

const formatCurrency = (val: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(val)
}

const toUSD = (symbol: string, value: number) => {
  return symbol.startsWith('THAIGOLD') ? value / (exchangeRateTHB.value || 33.07) : value
}

const sortedHoldings = computed(() => {
  return [...aggregatedHoldings.value].sort((a, b) => {
    const valA = toUSD(a.symbol, a.quantity * (currentPrices.value[a.symbol] || (a.costBasis / a.quantity)))
    const valB = toUSD(b.symbol, b.quantity * (currentPrices.value[b.symbol] || (b.costBasis / b.quantity)))
    return valB - valA
  })
})

const totalProfitLoss = computed(() => {
  if (totalCostBasis.value === 0) return 0
  return currentTotalValue.value - totalCostBasis.value
})

const totalProfitLossPercent = computed(() => {
  if (totalCostBasis.value === 0) return 0
  return (totalProfitLoss.value / totalCostBasis.value) * 100
})

const getProfitLoss = (h: any) => {
  const currentVal = h.quantity * (currentPrices.value[h.symbol] || (h.costBasis / h.quantity))
  return currentVal - h.costBasis
}

// Chart Config
const colorPalette = [
  '#60a5fa', '#34d399', '#fb923c', '#f87171', '#a78bfa',
  '#f472b6', '#2dd4bf', '#fbbf24', '#818cf8', '#38bdf8'
]

const getAssetColor = (symbol: string) => {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

const chartData = computed(() => {
  return {
    labels: aggregatedHoldings.value.map(h => h.symbol),
    datasets: [
      {
        backgroundColor: aggregatedHoldings.value.map(h => getAssetColor(h.symbol)),
        data: aggregatedHoldings.value.map(h => {
          // Use current value for allocation if available, else fallback to cost basis
          let price = currentPrices.value[h.symbol] || (h.quantity > 0 ? h.costBasis / h.quantity : 0)
          if (h.symbol.startsWith('THAIGOLD')) price = price / 33.07
          return h.quantity * price
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
        font: { family: 'Inter, system-ui, sans-serif' },
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          let label = context.label || ''
          if (label) label += ': '
          if (context.parsed !== null) {
            label += formatCurrency(context.parsed)
          }
          return label
        }
      }
    }
  }
}
</script>
