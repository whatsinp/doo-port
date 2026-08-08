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
                >แผงควบคุม</NuxtLink
              >
              <NuxtLink
                href="/portfolio"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >พอร์ตการลงทุน</NuxtLink
              >
              <NuxtLink
                href="/market"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >ตลาด</NuxtLink
              >
              <NuxtLink
                href="/favorites"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >รายการที่น่าสนใจ</NuxtLink
              >
              <NuxtLink
                href="/settings"
                class="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >การตั้งค่า</NuxtLink
              >
              <NuxtLink
                href="/admin"
                class="border-transparent text-red-500 dark:text-red-400 hover:border-red-600 hover:text-red-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold"
                >ผู้ดูแลระบบ</NuxtLink
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

            <div class="flex items-center gap-2 mr-4">
              <img
                v-if="profile?.avatarUrl"
                :src="profile.avatarUrl"
                alt="Profile"
                class="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
              <div
                v-else
                class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold"
              >
                {{ (profile?.nickname || auth.user.value?.email || '?').charAt(0).toUpperCase() }}
              </div>
              <span v-if="auth.user.value" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{
                profile?.nickname || auth.user.value.email
              }}</span>
            </div>

            <button @click="handleLogout" class="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
              <i class="pi pi-sign-out"></i>
              <span>ออกจากระบบ</span>
            </button>
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
import { useProfile } from '~/features/profile/composables/useProfile'
import { useRouter } from '#app'

const auth = useAuth()
const { unreadCount } = useNotifications()
const { profile } = useProfile()
const router = useRouter()

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>
