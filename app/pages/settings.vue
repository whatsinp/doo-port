<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">การตั้งค่า</h1>
      <p class="text-gray-500 dark:text-gray-400">จัดการการตั้งค่าบัญชีและโปรไฟล์ของคุณ</p>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"/>
    </div>

    <div v-else-if="profile" class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div class="p-6 space-y-8">


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
import { useProfile } from '~/features/profile/composables/useProfile'

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

// Sync local state when profile loads
watch(
  profile,
  (newVal) => {
    if (newVal) {
      selectedLanguage.value = newVal.language
      selectedTheme.value = newVal.theme
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


</script>
