// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'app/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
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
      ripple: true
    }
  },
  i18n: {
    defaultLocale: 'th',
    strategy: 'no_prefix',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'th', language: 'th-TH', file: 'th.json', name: 'ไทย' }
    ]
  }
})
