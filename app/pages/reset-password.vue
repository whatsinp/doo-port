<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          ตั้งรหัสผ่านใหม่
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          กรุณากำหนดรหัสผ่านใหม่ของคุณ
        </p>
      </div>

      <div v-if="!oobCode" class="mt-8">
        <Message severity="error" :closable="false">ลิงก์ไม่ถูกต้อง หรือหมดอายุแล้ว</Message>
        <div class="mt-4 text-center">
          <NuxtLink
            href="/forgot-password"
            class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ขอลิงก์รีเซ็ตรหัสผ่านใหม่
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="successMsg" class="mt-8">
        <Message severity="success" :closable="false">{{ successMsg }}</Message>
        <div class="mt-6">
          <NuxtLink
            href="/auth?mode=login"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            เข้าสู่ระบบด้วยรหัสผ่านใหม่
          </NuxtLink>
        </div>
      </div>

      <form v-else class="mt-8 space-y-6" @submit.prevent="handleReset">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="new-password" class="sr-only">รหัสผ่านใหม่</label>
            <Password
              id="new-password"
              v-model="newPassword"
              toggleMask
              required
              class="w-full custom-password"
              placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
            />
          </div>
          <div>
            <label for="confirm-password" class="sr-only">ยืนยันรหัสผ่านใหม่</label>
            <Password
              id="confirm-password"
              v-model="confirmPassword"
              toggleMask
              :feedback="false"
              required
              class="w-full custom-password"
              placeholder="ยืนยันรหัสผ่านใหม่"
            />
          </div>
        </div>

        <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>

        <div>
          <Button type="submit" :loading="loading" label="เปลี่ยนรหัสผ่าน" class="w-full" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useRoute, useRouter } from '#app'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const router = useRouter()
const auth = useAuth()

const oobCode = ref<string | null>((route.query.oobCode as string) || null)
const newPassword = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

const handleReset = async () => {
  if (newPassword.value.length < 6) {
    errorMsg.value = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }

  loading.value = true
  errorMsg.value = ''
  
  try {
    if (!oobCode.value) throw new Error('Invalid code')
    await auth.confirmResetPassword(oobCode.value, newPassword.value)
    successMsg.value = 'เปลี่ยนรหัสผ่านสำเร็จแล้ว'
  } catch (error: any) {
    errorMsg.value = 'เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.custom-password input) {
  width: 100%;
  padding-right: 2.5rem !important;
  padding-left: 1rem !important;
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
  border-radius: 0.75rem !important;
  background-color: #ffffff !important;
  border: 1px solid rgb(229 231 235) !important;
  color: rgb(17 24 39) !important;
}
:deep(.dark .custom-password input) {
  background-color: rgba(17, 24, 39, 0.5) !important;
  border-color: rgb(55 65 81) !important;
  color: white !important;
}
:deep(.custom-password > svg),
:deep(.custom-password > i) {
  position: absolute !important;
  right: 1.25rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin-top: 0 !important;
  color: #9ca3af !important;
  cursor: pointer;
  z-index: 20;
}
</style>
