<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button @click="isMobileMenuOpen = true" class="sm:hidden mr-3 p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none flex flex-col items-center justify-center">
              <i class="pi pi-bars text-xl"></i>
              <span class="text-[10px] font-bold mt-0.5">เมนู</span>
            </button>
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

            <!-- Profile Dropdown -->
            <div class="relative ml-2" ref="dropdownRef">
              <button
                @click="isDropdownOpen = !isDropdownOpen"
                class="flex items-center focus:outline-none relative group"
              >
                <!-- Avatar -->
                <div class="relative">
                  <img
                    v-if="profile?.avatarUrl"
                    :src="profile.avatarUrl"
                    alt="Profile"
                    class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 hover:brightness-95 transition-all"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold hover:brightness-95 transition-all"
                  >
                    {{
                      (profile?.nickname || auth.user.value?.email || '?').charAt(0).toUpperCase()
                    }}
                  </div>
                  <!-- Little Chevron down badge like Facebook -->
                  <div
                    class="absolute -bottom-1 -right-1 bg-gray-200 dark:bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center border border-white dark:border-gray-800 shadow-sm"
                  >
                    <i
                      class="pi pi-chevron-down text-[10px] text-gray-800 dark:text-gray-200 font-bold"
                    ></i>
                  </div>
                </div>
              </button>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95 -translate-y-2"
                enter-to-class="transform opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="transform opacity-100 scale-100 translate-y-0"
                leave-to-class="transform opacity-0 scale-95 -translate-y-2"
              >
                <div
                  v-if="isDropdownOpen"
                  class="origin-top-right absolute right-0 mt-3 w-[340px] rounded-2xl shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none p-4 border border-gray-200 dark:border-gray-700 z-50"
                >
                  <!-- Header area -->
                  <div
                    class="shadow-md rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 mb-3 bg-white dark:bg-gray-800/80"
                  >
                    <div class="flex items-center gap-3 mb-4">
                      <img
                        v-if="profile?.avatarUrl"
                        :src="profile.avatarUrl"
                        class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                      <div
                        v-else
                        class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xl"
                      >
                        {{
                          (profile?.nickname || auth.user.value?.email || '?')
                            .charAt(0)
                            .toUpperCase()
                        }}
                      </div>
                      <span
                        class="text-[17px] font-bold text-gray-900 dark:text-white line-clamp-1"
                      >
                        {{ profile?.nickname || auth.user.value?.email }}
                      </span>
                    </div>
                    <NuxtLink
                      to="/profile"
                      @click="isDropdownOpen = false"
                      class="block w-full text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 font-bold rounded-lg transition-colors text-sm"
                    >
                      <i class="pi pi-user mr-1"></i> ดูโปรไฟล์ทั้งหมด
                    </NuxtLink>
                  </div>

                  <!-- Menu Items -->
                  <div class="flex flex-col gap-1">
                    <NuxtLink
                      to="/settings"
                      @click="isDropdownOpen = false"
                      class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 flex items-center justify-center transition-colors shadow-sm"
                        >
                          <i class="pi pi-cog text-xl text-gray-900 dark:text-white"></i>
                        </div>
                        <span class="font-semibold text-gray-900 dark:text-white text-[15px]"
                          >การตั้งค่า</span
                        >
                      </div>
                      <i
                        class="pi pi-angle-right text-gray-500 dark:text-gray-400 text-xl group-hover:text-gray-700 dark:group-hover:text-gray-200"
                      ></i>
                    </NuxtLink>

                    <button
                      @click="handleLogoutClick"
                      class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group cursor-pointer w-full text-left"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 flex items-center justify-center transition-colors shadow-sm"
                        >
                          <i class="pi pi-sign-out text-xl text-gray-900 dark:text-white"></i>
                        </div>
                        <span class="font-semibold text-gray-900 dark:text-white text-[15px]"
                          >ออกจากระบบ</span
                        >
                      </div>
                      <i
                        class="pi pi-angle-right text-gray-500 dark:text-gray-400 text-xl group-hover:text-gray-700 dark:group-hover:text-gray-200"
                      ></i>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Side Menu -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 sm:hidden">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="isMobileMenuOpen = false"></div>
      
      <!-- Drawer -->
      <div class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transform transition-transform duration-300">
        <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <span class="text-xl font-bold text-blue-600 dark:text-blue-400">Doo-Port</span>
          <button @click="isMobileMenuOpen = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white focus:outline-none p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors">
            <i class="pi pi-times text-lg"></i>
          </button>
        </div>
        <div class="px-3 pt-4 pb-3 space-y-1">
          <NuxtLink href="/dashboard" @click="isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-home mr-2"></i> แผงควบคุม
          </NuxtLink>
          <NuxtLink href="/portfolio" @click="isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-chart-pie mr-2"></i> พอร์ตการลงทุน
          </NuxtLink>
          <NuxtLink href="/market" @click="isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-chart-line mr-2"></i> ตลาด
          </NuxtLink>
          <NuxtLink href="/favorites" @click="isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 transition-colors">
            <i class="pi pi-star mr-2"></i> รายการที่น่าสนใจ
          </NuxtLink>
          
          <hr class="border-gray-100 dark:border-gray-700 my-4 mx-2" />
          
          <NuxtLink href="/admin" @click="isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <i class="pi pi-shield mr-2"></i> ผู้ดูแลระบบ
          </NuxtLink>
        </div>
      </div>
    </div>

    <main>
      <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-6 sm:py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useNotifications } from '~/features/notifications/composables/useNotifications'
import { useProfile } from '~/features/profile/composables/useProfile'
import { useRouter } from '#app'

const auth = useAuth()
const { unreadCount } = useNotifications()
const { profile } = useProfile()
const router = useRouter()

const isDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

if (import.meta.client) {
  onClickOutside(dropdownRef, () => {
    isDropdownOpen.value = false
  })
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}

const handleLogoutClick = async () => {
  isDropdownOpen.value = false
  await handleLogout()
}
</script>
