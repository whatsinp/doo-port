<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 mb-2">
        <i class="pi pi-envelope text-4xl" />
      </div>
      
      <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">ยืนยันอีเมลของคุณ</h2>
      
      <p class="text-gray-500 dark:text-gray-400 mt-4">
        เราได้ส่งลิงก์ยืนยันตัวตนไปที่อีเมลของคุณแล้ว<br/>
        <strong class="text-gray-900 dark:text-white">{{ auth.user.value?.email }}</strong><br/>
        กรุณาคลิกลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชีของคุณ
      </p>

      <div class="mt-8 space-y-4">
        <button
          @click="checkVerification"
          :disabled="checking"
          class="w-full py-3.5 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
        >
          <i v-if="checking" class="pi pi-spinner pi-spin" />
          ฉันยืนยันอีเมลเรียบร้อยแล้ว
        </button>

        <button
          @click="resendEmail"
          :disabled="resending"
          class="w-full py-3.5 rounded-xl text-gray-700 dark:text-gray-300 font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
        >
          <i v-if="resending" class="pi pi-spinner pi-spin" />
          <i v-else class="pi pi-refresh" />
          ส่งอีเมลยืนยันอีกครั้ง
        </button>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <button
          @click="handleLogout"
          class="text-sm font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400"
        >
          ออกจากระบบ / สลับบัญชี
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'auth' })

const router = useRouter()
const auth = useAuth()
const toast = useToast()

const checking = ref(false)
const resending = ref(false)
let interval: any

onMounted(() => {
  // If user is already verified or not logged in, redirect away
  if (!auth.user.value) {
    router.push('/auth?mode=login')
    return
  }
  if (auth.user.value.emailVerified) {
    router.push('/dashboard')
    return
  }

  // Auto-check periodically
  interval = setInterval(() => {
    checkVerification(true)
  }, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const checkVerification = async (silent = false) => {
  if (!silent) checking.value = true
  try {
    await auth.user.value?.reload()
    if (auth.user.value?.emailVerified) {
      if (!silent) toast.success('อีเมลได้รับการยืนยันแล้ว!', 'Success')
      if (interval) clearInterval(interval)
      router.push('/dashboard')
    } else {
      if (!silent) toast.error('ยังไม่พบการยืนยันอีเมล กรุณาตรวจสอบอีกครั้ง', 'Verification Pending')
    }
  } catch (error: any) {
    console.error(error)
  } finally {
    if (!silent) checking.value = false
  }
}

const resendEmail = async () => {
  resending.value = true
  try {
    await auth.sendVerificationEmail({
      url: `${window.location.origin}/dashboard`,
      handleCodeInApp: true
    })
    toast.success('ส่งอีเมลยืนยันอีกครั้งแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ', 'Email Sent')
  } catch (error: any) {
    toast.error(error.message || 'ไม่สามารถส่งอีเมลได้', 'Error')
  } finally {
    resending.value = false
  }
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/auth?mode=login')
}
</script>
