<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">การตั้งค่า</h1>
      <p class="text-gray-500 dark:text-gray-400">จัดการการตั้งค่าบัญชีและโปรไฟล์ของคุณ</p>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div v-else-if="profile" class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="p-6 space-y-8">
        <!-- Account Info -->
        <section>
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">ข้อมูลบัญชี</h2>
          <div
            class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6"
          >
            <div class="relative group">
              <img
                v-if="profile?.avatarUrl"
                :src="profile.avatarUrl"
                alt="Profile"
                class="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <div
                v-else
                class="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold border-2 border-gray-200 dark:border-gray-700"
              >
                {{ (profile?.nickname || auth.user.value?.email || '?').charAt(0).toUpperCase() }}
              </div>
              <label
                for="avatar-upload"
                class="absolute inset-0 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <i v-if="!uploadingAvatar" class="pi pi-camera text-xl"></i>
                <i v-else class="pi pi-spin pi-spinner text-xl"></i>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
                :disabled="uploadingAvatar"
              />
            </div>

            <div class="flex-1 max-w-sm space-y-3">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">ชื่อเล่น (Nickname)</p>
                <div class="flex gap-2">
                  <input
                    v-model="nicknameInput"
                    type="text"
                    placeholder="ตั้งชื่อเล่น..."
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    @click="saveNickname"
                    :disabled="savingNickname"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                  >
                    <i v-if="savingNickname" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-save"></i>
                    บันทึก
                  </button>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">อีเมล</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ auth.user.value?.email }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-gray-200 dark:border-gray-700" />

        <!-- Preferences -->
        <section>
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">การตั้งค่าทั่วไป</h2>
          <div class="space-y-6 max-w-md">
            <!-- Language -->
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >ภาษาที่แสดง</label
              >
              <CustomSelect
                v-model="selectedLanguage"
                :options="languages"
                @change="savePreferences"
              />
            </div>

            <!-- Theme -->
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">ธีมของระบบ</label>
              <CustomSelect v-model="selectedTheme" :options="themes" @change="savePreferences" />
            </div>


          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useProfile } from '~/features/profile/composables/useProfile'

const { $storage } = useNuxtApp() as any
const auth = useAuth()
const { profile, loading, updateProfile } = useProfile()

const languages = [
  { label: 'English', value: 'en' },
  { label: 'ไทย (Thai)', value: 'th' }
]

const themes = [
  { label: 'สว่าง (Light)', value: 'light' },
  { label: 'มืด (Dark)', value: 'dark' }
]



const selectedLanguage = ref('en')
const selectedTheme = ref('light')
const nicknameInput = ref('')
const savingNickname = ref(false)
const uploadingAvatar = ref(false)

// Sync local state when profile loads
watch(
  profile,
  (newVal) => {
    if (newVal) {
      selectedLanguage.value = newVal.language
      selectedTheme.value = newVal.theme
      nicknameInput.value = newVal.nickname || ''
    }
  },
  { immediate: true }
)

const savePreferences = async () => {
  await updateProfile({
    language: selectedLanguage.value,
    theme: selectedTheme.value as 'light' | 'dark'
  })
}

const saveNickname = async () => {
  savingNickname.value = true
  try {
    await updateProfile({ nickname: nicknameInput.value })
  } finally {
    savingNickname.value = false
  }
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]

  if (!file.type.startsWith('image/')) {
    alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น')
    return
  }

  uploadingAvatar.value = true
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `avatars/${auth.user.value?.uid}-${Date.now()}.${fileExt}`
    const sRef = storageRef($storage, fileName)

    await uploadBytes(sRef, file)
    const downloadUrl = await getDownloadURL(sRef)

    await updateProfile({ avatarUrl: downloadUrl })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
  } finally {
    uploadingAvatar.value = false
  }
}
</script>
