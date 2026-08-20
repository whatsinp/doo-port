<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    
    <div class="w-full max-w-md z-10">
      <div class="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 flex flex-col justify-center transition-all duration-300">
        
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white mb-4 shadow-lg shadow-amber-500/30">
            <i class="pi pi-key text-3xl"/>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">ลืมรหัสผ่าน?</h2>
          <p class="text-gray-500 dark:text-gray-400 mt-2">กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับรีเซ็ตรหัสผ่าน</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleReset">
          <div class="space-y-4">
            <!-- Email Input -->
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 z-20 pointer-events-none text-gray-400 group-focus-within:text-amber-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </span>
              <input
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="อีเมล"
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              >
            </div>
          </div>

          <!-- Alert Messages -->
          <div v-if="errorMsg" class="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-sm text-rose-600 dark:text-rose-400 flex items-start gap-2">
            <i class="pi pi-exclamation-circle mt-0.5" />
            <span>{{ errorMsg }}</span>
          </div>

          <div v-if="successMsg" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5" />
            <span>{{ successMsg }}</span>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:ring-4 focus:ring-amber-500/30 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="pi pi-spinner pi-spin"/>
            {{ loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน' }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <NuxtLink
            href="/auth?mode=login"
            class="text-sm font-bold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <i class="pi pi-arrow-left text-xs" /> กลับไปหน้าเข้าสู่ระบบ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'

definePageMeta({ layout: 'auth' })

const email = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)
const auth = useAuth()

const handleReset = async () => {
  if (!email.value) return
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: false
    }
    await auth.resetPassword(email.value, actionCodeSettings)
    successMsg.value = 'ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว! กรุณาตรวจสอบกล่องจดหมายของคุณ'
  } catch (error: any) {
    // Note: Firebase doesn't always throw user-not-found due to email enumeration protection
    if (error.code === 'auth/user-not-found' || (error.message && error.message.includes('not found'))) {
      errorMsg.value = 'ไม่พบบัญชีผู้ใช้ที่เชื่อมโยงกับอีเมลนี้ กรุณาตรวจสอบอีกครั้ง'
    } else {
      errorMsg.value = 'เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้')
    }
  } finally {
    loading.value = false
  }
}
</script>
