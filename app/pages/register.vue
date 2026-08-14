<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <i class="pi pi-spinner pi-spin text-3xl text-emerald-500"/>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from '#app'
import { onMounted } from 'vue'

definePageMeta({ layout: 'auth' })

const router = useRouter()
onMounted(() => {
  router.replace('/auth?mode=register')
})
</script>
