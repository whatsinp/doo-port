<template>
  <div class="relative w-full h-[300px]">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10 backdrop-blur-sm rounded-lg">
      <i class="pi pi-spinner pi-spin text-3xl text-blue-500"/>
    </div>
    <div ref="chartContainer" class="w-full h-full overflow-hidden"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { createChart, ColorType, AreaSeries } from 'lightweight-charts'
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  data: any[]
  loading?: boolean
  color?: string
}>()

const chartContainer = ref<HTMLElement | null>(null)
let chart: IChartApi | null = null
let areaSeries: ISeriesApi<"Area"> | null = null

const { width } = useWindowSize()

// Responsive resize
watch(width, () => {
  if (chart && chartContainer.value) {
    chart.applyOptions({ width: chartContainer.value.clientWidth })
  }
})

const updateChartData = () => {
  if (!areaSeries || !props.data.length) return
  areaSeries.setData(props.data)
  chart?.timeScale().fitContent()
}

watch(() => props.data, () => {
  updateChartData()
}, { deep: true })

watch(() => props.color, (newColor) => {
  if (areaSeries && chart) {
    const chartColor = newColor || '#3b82f6'
    areaSeries.applyOptions({
      lineColor: chartColor,
      topColor: `${chartColor}40`,
      bottomColor: `${chartColor}00`,
    })
    chart.applyOptions({
      crosshair: {
        vertLine: {
          color: chartColor,
          labelBackgroundColor: chartColor,
        },
        horzLine: {
          color: chartColor,
          labelBackgroundColor: chartColor,
        }
      }
    })
  }
})

onMounted(() => {
  if (!chartContainer.value) return

  const isDark = document.documentElement.classList.contains('dark')
  const chartColor = props.color || '#3b82f6' // Default to blue-500

  chart = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: 300,
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      textColor: isDark ? '#9ca3af' : '#6b7280',
      attributionLogo: false,
    },
    grid: {
      vertLines: { color: isDark ? '#374151' : '#f3f4f6' },
      horzLines: { color: isDark ? '#374151' : '#f3f4f6' },
    },
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      timeVisible: true,
      secondsVisible: false,
    },
    crosshair: {
      vertLine: {
        width: 1,
        color: chartColor,
        style: 3,
        labelBackgroundColor: chartColor,
      },
      horzLine: {
        width: 1,
        color: chartColor,
        style: 3,
        labelBackgroundColor: chartColor,
      },
    },
    handleScroll: false,
    handleScale: false,
  })

  areaSeries = chart.addSeries(AreaSeries, {
    lineColor: chartColor,
    topColor: `${chartColor}40`, // 25% opacity
    bottomColor: `${chartColor}00`, // 0% opacity
    lineWidth: 2,
    priceFormat: {
      type: 'price',
      precision: 2,
      minMove: 0.01,
    },
  })

  updateChartData()
})

onUnmounted(() => {
  if (chart) {
    chart.remove()
    chart = null
  }
})
</script>
