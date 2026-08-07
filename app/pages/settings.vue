<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('settings') || 'Settings' }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400">Manage your account preferences and profile.</p>
    </div>

    <div v-if="loading" class="flex justify-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    </div>

    <div v-else-if="profile" class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="p-6 space-y-8">
        <!-- Account Info -->
        <section>
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Account Information
          </h2>
          <div class="flex items-center space-x-4">
            <div
              class="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold"
            >
              {{ auth.user.value?.email?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
              <p class="font-medium text-gray-900 dark:text-white">{{ auth.user.value?.email }}</p>
            </div>
          </div>
        </section>

        <hr class="border-gray-200 dark:border-gray-700" />

        <!-- Preferences -->
        <section>
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Preferences</h2>
          <div class="space-y-6 max-w-md">
            <!-- Language -->
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >Display Language</label
              >
              <Dropdown
                v-model="selectedLanguage"
                :options="languages"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                @change="savePreferences"
              />
            </div>

            <!-- Theme -->
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >Interface Theme</label
              >
              <Dropdown
                v-model="selectedTheme"
                :options="themes"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                @change="savePreferences"
              />
            </div>

            <!-- Currency -->
            <div class="flex flex-col space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >Default Currency</label
              >
              <Dropdown
                v-model="selectedCurrency"
                :options="currencies"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                @change="savePreferences"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useProfile } from '~/features/profile/composables/useProfile'

const auth = useAuth()
const { profile, loading, updateProfile } = useProfile()

const languages = [
  { label: 'English', value: 'en' },
  { label: 'ไทย (Thai)', value: 'th' }
]

const themes = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const currencies = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'THB (฿)', value: 'THB' }
]

const selectedLanguage = ref('en')
const selectedTheme = ref('light')
const selectedCurrency = ref('USD')

// Sync local state when profile loads
watch(
  profile,
  (newVal) => {
    if (newVal) {
      selectedLanguage.value = newVal.language
      selectedTheme.value = newVal.theme
      selectedCurrency.value = newVal.defaultCurrency
    }
  },
  { immediate: true }
)

const savePreferences = async () => {
  await updateProfile({
    language: selectedLanguage.value,
    theme: selectedTheme.value as 'light' | 'dark',
    defaultCurrency: selectedCurrency.value
  })
}
</script>
