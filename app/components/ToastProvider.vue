<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-400 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-300 ease-in absolute w-full"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
      move-class="transition duration-400 ease-out"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto rounded-xl p-4 shadow-xl border backdrop-blur-md relative overflow-hidden group"
        :class="[
          toast.type === 'error' ? 'bg-red-500/90 border-red-400/50 text-white' : '',
          toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/50 text-white' : '',
          toast.type === 'warning' ? 'bg-amber-500/90 border-amber-400/50 text-white' : '',
          toast.type === 'info' ? 'bg-blue-500/90 border-blue-400/50 text-white' : ''
        ]"
      >
        <!-- Glassmorphism shine effect -->
        <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="flex items-start gap-3 relative z-10">
          <!-- Icons -->
          <div class="flex-shrink-0 mt-0.5">
            <i v-if="toast.type === 'error'" class="pi pi-times-circle text-xl"></i>
            <i v-else-if="toast.type === 'success'" class="pi pi-check-circle text-xl"></i>
            <i v-else-if="toast.type === 'warning'" class="pi pi-exclamation-triangle text-xl"></i>
            <i v-else class="pi pi-info-circle text-xl"></i>
          </div>
          
          <div class="flex-1">
            <h4 v-if="toast.title" class="font-bold text-sm mb-0.5">{{ toast.title }}</h4>
            <p class="text-sm opacity-90">{{ toast.message }}</p>
          </div>
          
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/10"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()
</script>
