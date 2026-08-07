<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink href="/dashboard" class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-blue-600 dark:text-blue-400">Doo-Port</span>
            </NuxtLink>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                href="/dashboard"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >Dashboard</NuxtLink
              >
              <NuxtLink
                href="/portfolio"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >Portfolios</NuxtLink
              >
              <NuxtLink
                href="/market"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >Market</NuxtLink
              >
              <NuxtLink
                href="/favorites"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >Watchlist</NuxtLink
              >
              <NuxtLink
                href="/settings"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >Settings</NuxtLink
              >
              <NuxtLink
                href="/admin"
                class="border-transparent text-red-500 dark:text-red-400 hover:border-red-600 hover:text-red-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold"
                >Admin</NuxtLink
              >
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Notification Bell -->
            <div class="relative cursor-pointer mr-2">
              <i
                class="pi pi-bell text-gray-500 dark:text-gray-300 text-xl hover:text-gray-700"
              ></i>
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
              >
                {{ unreadCount }}
              </span>
            </div>

            <span v-if="auth.user.value" class="text-sm text-gray-700 dark:text-gray-300">{{
              auth.user.value.email
            }}</span>
            <Button icon="pi pi-sign-out" text rounded aria-label="Logout" @click="handleLogout" />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/features/auth/composables/useAuth'
import { useNotifications } from '~/features/notifications/composables/useNotifications'
import { useRouter } from '#app'
import 'primeicons/primeicons.css'

const auth = useAuth()
const { unreadCount } = useNotifications()
const router = useRouter()

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
