<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('dashboard') || 'Dashboard' }}
      </h1>
      <NuxtLink href="/portfolio">
        <Button label="Manage Portfolios" icon="pi pi-briefcase" />
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Total Investment Cost
          </p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalCostBasis) }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Assets</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ allHoldings.length }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Valuation</p>
          <p class="text-3xl font-bold text-gray-400 dark:text-gray-500 italic">
            Pending Market Data API
          </p>
        </div>
      </div>

      <!-- Chart Placeholder -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Performance Chart</h2>
        <div
          class="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-300 dark:border-gray-600"
        >
          <div class="text-center">
            <i class="pi pi-chart-line text-4xl mb-2"></i>
            <p>Chart requires historical market data (Coming soon)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboard } from '~/features/dashboard/composables/useDashboard'
import { useProfile } from '~/features/profile/composables/useProfile'

const { allHoldings, loading, totalCostBasis } = useDashboard()
const { profile } = useProfile()

const formatCurrency = (val: number) => {
  const currency = profile.value?.defaultCurrency || 'USD'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(val)
}
</script>
