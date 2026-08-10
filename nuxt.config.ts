import Aura from '@primevue/themes/aura'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Doo Port'
    }
  },
  css: ['~/assets/css/main.css', 'primeicons/primeicons.css'],
  runtimeConfig: {
    finnhubApiKey: '',
    coingeckoApiKey: '',
    goldApiKey: '',
    public: {
      apiBaseUrl: 'http://127.0.0.1:5001/gen-lang-client-0765785441/us-central1/api/api/v1',
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      firebaseMeasurementId: ''
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/eslint'
  ],
  typescript: {
    strict: true
  },
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura
      }
    },
    components: {
      include: '*'
    }
  },
  i18n: {
    defaultLocale: 'th',
    strategy: 'no_prefix',
    locales: ['en', 'th'],
    vueI18n: './i18n.config.ts'
  }
})
