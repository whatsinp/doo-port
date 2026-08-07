<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
      <NuxtLink href="/market">
        <Button label="Search Market" icon="pi pi-search" outlined />
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div
      v-else-if="favorites.length === 0"
      class="bg-white dark:bg-gray-800 p-12 text-center rounded-xl shadow border border-gray-200 dark:border-gray-700"
    >
      <i class="pi pi-star text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Your watchlist is empty</h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Search for assets in the market and star them to track here.
      </p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <DataTable :value="favorites" responsiveLayout="scroll">
        <Column
          field="symbol"
          header="Symbol"
          class="font-bold text-blue-600 dark:text-blue-400"
        ></Column>
        <Column field="name" header="Name"></Column>
        <Column>
          <template #body="{ data }">
            <Button
              icon="pi pi-star-fill"
              class="p-button-rounded p-button-warning p-button-text"
              @click="toggleFavorite(data.symbol, data.name)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavorites } from '~/features/favorites/composables/useFavorites'

const { favorites, loading, toggleFavorite } = useFavorites()
</script>
