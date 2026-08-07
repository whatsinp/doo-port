<template>
  <div ref="chartContainer" class="w-full h-full relative">
    <!-- Chart will be injected here -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { createChart, IChartApi, ISeriesApi, ColorType, LineSeries } from 'lightweight-charts'
import { useWindowSize } from '@vueuse/core'

const props = defineProps<{
  data: { time: number; value: number }[]
  color?: string
}>()

const chartContainer = ref<HTMLElement | null>(null)
let chart: IChartApi | null = null
let lineSeries: ISeriesApi<"Line"> | null = null

const { width } = useWindowSize()

// Responsive resize
watch(width, () => {
  if (chart && chartContainer.value) {
    chart.applyOptions({ width: chartContainer.value.clientWidth })
  }
})

const updateChartData = () => {
  if (!lineSeries || !props.data || !props.data.length) return
  lineSeries.setData(props.data)
  chart?.timeScale().fitContent()
}

watch(() => props.data, () => {
  updateChartData()
}, { deep: true })

onMounted(() => {
  if (!chartContainer.value) return

  const chartColor = props.color || '#3b82f6'

  chart = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: chartContainer.value.clientHeight || 40,
    layout: {
      background: { type: ColorType.Solid, color: 'transparent' },
      attributionLogo: false,
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { visible: false },
    },
    rightPriceScale: {
      visible: false,
    },
    leftPriceScale: {
      visible: false,
    },
    timeScale: {
      visible: false,
    },
    crosshair: {
      mode: 2, // Hidden
    },
    handleScroll: false,
    handleScale: false,
  })

  lineSeries = chart.addSeries(LineSeries, {
    color: chartColor,
    lineWidth: 2,
    crosshairMarkerVisible: false,
    lastValueVisible: false,
    priceLineVisible: false,
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
