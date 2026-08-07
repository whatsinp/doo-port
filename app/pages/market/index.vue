<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Market Search</h1>
      <p class="text-gray-500 dark:text-gray-400">
        Search for stocks, crypto, and other assets to view their live data.
      </p>
    </div>

    <!-- Search Box -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <form @submit.prevent="handleSearch" class="flex gap-4">
        <div class="relative flex-1">
          <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <InputText
            v-model="searchQuery"
            placeholder="Search by symbol or name (e.g., AAPL, Apple)"
            class="w-full pl-10"
          />
        </div>
        <Button type="submit" label="Search" :loading="loading" />
      </form>
      <Message v-if="errorMsg" severity="error" class="mt-4">{{ errorMsg }}</Message>
    </div>

    <!-- Results -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <DataTable :value="results" :loading="loading" responsiveLayout="scroll">
        <template #empty>
          <div class="p-12 text-center text-gray-500 dark:text-gray-400">
            <i class="pi pi-chart-bar text-5xl mb-4 text-gray-300 dark:text-gray-600"></i>
            <p v-if="searchQuery && !loading">No assets found matching '{{ searchQuery }}'</p>
            <p v-else>Enter a search query to discover assets.</p>
          </div>
        </template>

        <Column
          field="symbol"
          header="Symbol"
          class="font-bold text-blue-600 dark:text-blue-400 w-1/4"
        ></Column>
        <Column field="name" header="Name" class="w-1/3"></Column>
        <Column field="type" header="Type">
          <template #body="{ data }">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">{{
              data.type
            }}</span>
          </template>
        </Column>
        <Column field="exchange" header="Exchange"></Column>
        <Column field="currency" header="Currency"></Column>

        <Column>
          <template #body="{ data }">
            <Button icon="pi pi-eye" text rounded aria-label="View Details" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMarket } from '~/features/market/composables/useMarket'

const searchQuery = ref('')
const { searchAssets, results, loading, errorMsg } = useMarket()

const handleSearch = () => {
  searchAssets(searchQuery.value)
}
</script>
