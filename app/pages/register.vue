<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create a new account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
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
          <div>
            <label for="password" class="sr-only">Password</label>
            <Password
              id="password"
              v-model="password"
              toggleMask
              class="w-full [&>input]:w-full"
              inputClass="w-full"
              placeholder="Password (min 6 chars)"
            />
          </div>
        </div>

        <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>

        <div>
          <Button type="submit" :loading="loading" label="Sign up" class="w-full" />
        </div>

        <div class="mt-4 text-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">Already have an account? </span>
          <NuxtLink
            href="/login"
            class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useRouter } from '#app'

definePageMeta({ layout: 'auth' })

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const auth = useAuth()
const router = useRouter()

const handleRegister = async () => {
  if (password.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.registerWithEmail(email.value, password.value)
    router.push('/dashboard')
  } catch (error: any) {
    errorMsg.value = error.message || 'Failed to register'
  } finally {
    loading.value = false
  }
}
</script>
