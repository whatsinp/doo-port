<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Portfolios</h1>
        <p class="text-gray-500 dark:text-gray-400">Manage your investment portfolios.</p>
      </div>
      <Button label="New Portfolio" icon="pi pi-plus" @click="showCreateDialog = true" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="portfolios.length === 0"
      class="bg-white dark:bg-gray-800 p-12 text-center rounded-xl shadow border border-gray-200 dark:border-gray-700"
    >
      <i class="pi pi-folder-open text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No portfolios yet</h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Create your first portfolio to start tracking your investments.
      </p>
      <div class="mt-6">
        <Button label="Create Portfolio" icon="pi pi-plus" @click="showCreateDialog = true" />
      </div>
    </div>

    <!-- Portfolio Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Virtual "All Portfolios" Card -->
      <NuxtLink href="/portfolio/all" class="block">
        <div
          class="h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold">All Portfolios</h3>
            <i class="pi pi-globe text-2xl opacity-75"></i>
          </div>
          <p class="text-blue-100 mb-6">Aggregated view of all your investments.</p>
          <div class="text-sm font-medium opacity-90">{{ portfolios.length }} Portfolios Total</div>
        </div>
      </NuxtLink>

      <!-- Individual Portfolios -->
      <div
        v-for="p in portfolios"
        :key="p.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col justify-between"
      >
        <div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ p.name }}</h3>
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              aria-label="Delete"
              @click="confirmDelete(p.id)"
            />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Click to view holdings and transactions.
          </p>
        </div>
        <NuxtLink :href="`/portfolio/${p.id}`">
          <Button label="View Portfolio" outlined class="w-full" />
        </NuxtLink>
      </div>
    </div>

    <!-- Custom Create Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showCreateDialog"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
        @click.self="showCreateDialog = false"
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
            v-if="showCreateDialog"
            class="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i class="pi pi-folder-plus text-blue-500"></i> Create Portfolio
              </h2>
              <button 
                @click="showCreateDialog = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handleCreate" class="p-6">
              <div class="mb-6">
                <label for="portfolioName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Portfolio Name
                </label>
                <input
                  id="portfolioName"
                  v-model="newPortfolioName"
                  type="text"
                  required
                  placeholder="e.g. Retirement Fund, Crypto Bag"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  autofocus
                />
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  @click="showCreateDialog = false"
                  class="px-5 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="creating || !newPortfolioName.trim()"
                  class="px-5 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <i v-if="creating" class="pi pi-spinner pi-spin"></i>
                  <span>{{ creating ? 'Creating...' : 'Create Portfolio' }}</span>
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
import { usePortfolios } from '~/features/portfolio/composables/usePortfolios'

const { portfolios, loading, createPortfolio, deletePortfolio } = usePortfolios()
const showCreateDialog = ref(false)
const newPortfolioName = ref('')
const creating = ref(false)

const handleCreate = async () => {
  if (!newPortfolioName.value.trim()) return
  creating.value = true
  try {
    await createPortfolio(newPortfolioName.value.trim())
    showCreateDialog.value = false
    newPortfolioName.value = ''
  } catch (e) {
    console.error(e)
  } finally {
    creating.value = false
  }
}

const confirmDelete = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this portfolio? This cannot be undone.')) {
    await deletePortfolio(id)
  }
}
</script>
