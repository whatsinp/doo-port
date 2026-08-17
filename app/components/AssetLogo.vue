<template>
  <div class="relative overflow-hidden flex items-center justify-center font-bold" :style="{ backgroundColor: imageError ? getAssetColor(symbol) : 'transparent' }">
    <img 
      v-if="!imageError" 
      :src="logoUrl" 
      :alt="symbol" 
      class="w-full h-full object-cover"
      @error="imageError = true"
    >
    <template v-else>
      <div class="absolute inset-0 bg-white/20"/>
      <span class="relative z-10 text-white">{{ symbol.charAt(0) }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  symbol: string
}>()

const imageError = ref(false)

watch(() => props.symbol, () => {
  imageError.value = false
})

const colorPalette = [
  '#60a5fa', // Soft Blue
  '#34d399', // Soft Green
  '#fb923c', // Soft Orange
  '#f87171', // Soft Red
  '#a78bfa', // Soft Purple
  '#f472b6', // Soft Pink
  '#2dd4bf', // Soft Teal
  '#fbbf24', // Soft Amber
  '#818cf8', // Soft Indigo
  '#38bdf8'  // Soft Sky Blue
]

const getAssetColor = (symbol: string) => {
  if (!symbol) return colorPalette[0]
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

const getFavicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const LOGO_MAP: Record<string, string> = {
  'AAPL': getFavicon('apple.com'),
  'MSFT': getFavicon('microsoft.com'),
  'GOOGL': getFavicon('google.com'),
  'AMZN': getFavicon('amazon.com'),
  'NVDA': getFavicon('nvidia.com'),
  'META': getFavicon('meta.com'),
  'TSLA': getFavicon('tesla.com'),
  'PTT': getFavicon('pttplc.com'),
  'AOT': getFavicon('airportthai.co.th'),
  'ADVANC': getFavicon('ais.th'),
  'CPALL': getFavicon('cpall.co.th'),
  'KBANK': getFavicon('kasikornbank.com'),
  'SCB': getFavicon('scb.co.th'),
  'NFLX': getFavicon('netflix.com'),
  'DIS': getFavicon('thewaltdisneycompany.com'),
  'ASTS': getFavicon('ast-science.com'),
  'EOSE': getFavicon('eose.com'),
  'MU': getFavicon('micron.com'),
  'ONDS': getFavicon('ondas.com'),
  'RKLB': getFavicon('rocketlabusa.com'),
  'SNDK': getFavicon('westerndigital.com'),
  'SPCX': getFavicon('spacex.com'),
  'STRL': getFavicon('strlco.com'),
  'ASML': getFavicon('asml.com'),
  'INTC': getFavicon('intel.com'),
}

const logoUrl = ref('')

watch(() => props.symbol, async (newSymbol) => {
  imageError.value = false
  if (!newSymbol) {
    logoUrl.value = ''
    return
  }
  
  const sym = newSymbol.toUpperCase()
  
  // 1. Check known logos
  if (LOGO_MAP[sym]) {
    logoUrl.value = LOGO_MAP[sym]
    return
  }
  
  // 2. Check Thai Gold
  if (sym.startsWith('THAIGOLD') || sym === 'XAU' || sym === 'GOLD') {
    logoUrl.value = 'https://assets.coincap.io/assets/icons/paxg@2x.png'
    return
  }
  
  // 3. Check if it's a known crypto
  const isCrypto = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'DOT', 'MATIC'].includes(sym)
  if (isCrypto) {
    logoUrl.value = `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`
    return
  }

  // 4. Fallback to Finnhub Profile API for any unknown stock/asset
  try {
    const res = await $fetch<any>(`/api/market/profile/${sym}`)
    if (res && res.logo) {
      logoUrl.value = res.logo
    } else {
      logoUrl.value = `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`
    }
  } catch (e) {
    logoUrl.value = `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png`
  }
}, { immediate: true })
</script>
