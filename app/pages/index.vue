<template>
  <div>กำลังเปลี่ยนหน้า...</div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'

const auth = useAuth()
if (auth.user.value) {
  navigateTo('/dashboard')
} else {
  navigateTo('/login')
}
</script>
