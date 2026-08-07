<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
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
              :feedback="false"
              toggleMask
              class="w-full [&>input]:w-full"
              inputClass="w-full"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <NuxtLink
              href="/forgot-password"
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Forgot your password?
            </NuxtLink>
          </div>
        </div>


        <div>
          <Button type="submit" :loading="loading" label="Sign in" class="w-full" />
        </div>

        <div class="mt-4 text-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <NuxtLink
            href="/register"
            class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
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
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'auth' })

const email = ref('')
const password = ref('')
const loading = ref(false)
const auth = useAuth()
const router = useRouter()
const toast = useToast()

const handleLogin = async () => {
  loading.value = true
  try {
    await auth.loginWithEmail(email.value, password.value)
    toast.success('You have successfully logged in.', 'Welcome back!')
    router.push('/dashboard')
  } catch (error: any) {
    // Check for Firebase invalid credential or not found errors
    const errorMsg = error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
      ? 'Invalid email or password.'
      : error.message || 'Failed to login'
    toast.error(errorMsg, 'Login Failed')
  } finally {
    loading.value = false
  }
}
</script>
