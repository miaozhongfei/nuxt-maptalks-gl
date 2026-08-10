<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
// linear 渐变
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.24], [121.5057, 31.2453], [121.52, 31.25]],
  options: { symbol: { lineColor: { type: 'linear', colorStops: [[0, 'red'], [0.25, 'orange'], [0.5, 'green'], [0.75, 'aqua'], [1, 'white']] }, lineWidth: 10 } },
})
// radial 渐变
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.5057, 31.24], [121.52, 31.245]],
  options: { symbol: { lineColor: { type: 'radial', colorStops: [[0, 'red'], [0.33, 'orange'], [0.66, 'green'], [1, 'white']] }, lineWidth: 10 } },
})

const status = computed(() => (isReady.value ? '地图已创建（线渐变填充）' : '加载中…'))
</script>
