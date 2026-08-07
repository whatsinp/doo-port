<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email to receive a password reset link.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleReset">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <InputText
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="w-full"
              placeholder="Email address"
            />
          </div>
        </div>

        <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>
        <Message v-if="successMsg" severity="success" :closable="false">{{ successMsg }}</Message>

        <div>
          <Button type="submit" :loading="loading" label="Send Reset Link" class="w-full" />
        </div>

        <div class="mt-4 text-center">
          <NuxtLink
            href="/login"
            class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Back to login
          </NuxtLink>
        </div>
      </form>
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
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    await auth.resetPassword(email.value)
    successMsg.value = 'Password reset email sent! Please check your inbox.'
  } catch (error: any) {
    errorMsg.value = error.message || 'Failed to send reset email'
  } finally {
    loading.value = false
  }
}
</script>
