<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
    
    <!-- Background Decor -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-blob"></div>
    <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-400/30 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-blob animation-delay-2000"></div>
    <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-emerald-400/30 rounded-full blur-3xl mix-blend-multiply opacity-50 animate-blob animation-delay-4000"></div>

    <div class="w-full max-w-md h-[600px] perspective-1000 z-10">
      <div 
        class="w-full h-full relative transition-transform duration-700 ease-in-out preserve-3d"
        :class="{ 'rotate-y-180': isRegister }"
      >
        
        <!-- ================= FRONT: LOGIN FORM ================= -->
        <div class="absolute w-full h-full backface-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 flex flex-col justify-center">
          
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white mb-4 shadow-lg shadow-blue-500/30">
              <i class="pi pi-bolt text-3xl"></i>
            </div>
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to Doo-Port</p>
          </div>

          <form class="space-y-6" @submit.prevent="handleLogin">
            <div class="space-y-4">
              <!-- Email Input -->
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 z-20 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </span>
                <input
                  v-model="loginEmail"
                  type="email"
                  required
                  placeholder="Email address"
                  class="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>

              <!-- Password Input -->
              <div class="relative group pb-2">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 z-20 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </span>
                <Password
                  v-model="loginPassword"
                  :feedback="false"
                  toggleMask
                  class="w-full custom-password"
                  placeholder="Password"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <NuxtLink href="/forgot-password" class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                Forgot password?
              </NuxtLink>
            </div>

            <button 
              type="submit" 
              :disabled="loginLoading"
              class="w-full py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="loginLoading" class="pi pi-spinner pi-spin"></i>
              {{ loginLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="mt-8 text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <button type="button" @click="toggleMode" class="text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
              Create one now
            </button>
          </div>
        </div>

        <!-- ================= BACK: REGISTER FORM ================= -->
        <div class="absolute w-full h-full backface-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 rotate-y-180 flex flex-col justify-center">
          
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white mb-4 shadow-lg shadow-emerald-500/30">
              <i class="pi pi-user-plus text-3xl"></i>
            </div>
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Join Doo-Port to track your assets</p>
          </div>

          <form class="space-y-6" @submit.prevent="handleRegister">
            <div class="space-y-4">
              <!-- Email Input -->
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 z-20 pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </span>
                <input
                  v-model="registerEmail"
                  type="email"
                  required
                  placeholder="Email address"
                  class="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>

              <!-- Password Input -->
              <div class="relative group pb-6">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 z-20 pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </span>
                <Password
                  v-model="registerPassword"
                  toggleMask
                  class="w-full custom-password custom-password-emerald"
                  placeholder="Password (min 6 chars)"
                />
              </div>
            </div>

            <button 
              type="submit" 
              :disabled="registerLoading"
              class="w-full py-3.5 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-500/30 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="registerLoading" class="pi pi-spinner pi-spin"></i>
              {{ registerLoading ? 'Creating account...' : 'Sign Up' }}
            </button>
          </form>

          <div class="mt-8 text-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Already have an account? </span>
            <button type="button" @click="toggleMode" class="text-sm font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors">
              Sign In
            </button>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useRouter, useRoute } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'auth' })

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const toast = useToast()

const isRegister = ref(false)

// Login State
const loginEmail = ref('')
const loginPassword = ref('')
const loginLoading = ref(false)

// Register State
const registerEmail = ref('')
const registerPassword = ref('')
const registerLoading = ref(false)

onMounted(() => {
  if (route.query.mode === 'register') {
    isRegister.value = true
  }
})

const toggleMode = () => {
  isRegister.value = !isRegister.value
  // Update URL without reloading
  router.replace({ query: { mode: isRegister.value ? 'register' : 'login' } })
}

const handleLogin = async () => {
  loginLoading.value = true
  try {
    await auth.loginWithEmail(loginEmail.value, loginPassword.value)
    toast.success('You have successfully logged in.', 'Welcome back!')
    router.push('/dashboard')
  } catch (error: any) {
    const errorMsg = error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
      ? 'Invalid email or password.'
      : error.message || 'Failed to login'
    toast.error(errorMsg, 'Login Failed')
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  if (registerPassword.value.length < 6) {
    toast.error('Password must be at least 6 characters', 'Invalid Password')
    return
  }
  registerLoading.value = true
  try {
    await auth.registerWithEmail(registerEmail.value, registerPassword.value)
    toast.success('Your account has been created successfully.', 'Welcome!')
    router.push('/dashboard')
  } catch (error: any) {
    toast.error(error.message || 'Failed to register', 'Registration Failed')
  } finally {
    registerLoading.value = false
  }
}
</script>

<style>
/* 3D Flip Utilities */
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}

/* Custom Password styling to override PrimeVue and integrate icons */
.custom-password input {
  width: 100%;
  padding-left: 2.75rem !important; /* Make room for the left icon */
  padding-right: 2.5rem !important; /* Make room for the eye icon */
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
  border-radius: 0.75rem !important;
  background-color: rgb(249 250 251) !important;
  border: 1px solid rgb(229 231 235) !important;
  color: rgb(17 24 39) !important;
  transition-property: all !important;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
  transition-duration: 150ms !important;
}
.custom-password input::placeholder {
  color: #9ca3af !important; /* Tailwind gray-400 */
}
.custom-password {
  display: block;
  position: relative;
}
.custom-password > svg,
.custom-password > i {
  /* This targets the PrimeVue toggleMask eye icon */
  position: absolute !important;
  right: 1.25rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  color: #9ca3af !important;
  cursor: pointer;
  z-index: 20;
  width: 1.25rem !important;
  height: 1.25rem !important;
}
.custom-password input:focus {
  outline: 2px solid transparent !important;
  outline-offset: 2px !important;
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(59, 130, 246, 0.5);
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important;
  border-color: rgb(59 130 246) !important;
}

/* Dark mode for password input */
.dark .custom-password input {
  background-color: rgba(17, 24, 39, 0.5) !important;
  border-color: rgb(55 65 81) !important;
  color: white !important;
}

/* Emerald focus for register form */
.custom-password-emerald input:focus {
  --tw-ring-color: rgba(16, 185, 129, 0.5);
  border-color: rgb(16 185 129) !important;
}

/* Blob Animations */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
