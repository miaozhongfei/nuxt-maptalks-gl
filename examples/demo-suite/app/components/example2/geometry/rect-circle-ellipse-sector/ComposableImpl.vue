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
// 矩形
useMaptalksRectangle(layer, {
  coordinates: [121.488, 31.258],
  width: 1200,
  height: 800,
  options: { symbol: { polygonFill: '#f59e0b', polygonOpacity: 0.3, lineColor: '#d97706', lineWidth: 2 } },
})
// 圆
useMaptalksCircle(layer, {
  coordinates: [121.5057, 31.2453],
  radius: 600,
  options: { symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 } },
})
// 椭圆
useMaptalksEllipse(layer, {
  coordinates: [121.522, 31.252],
  width: 1400,
  height: 700,
  options: { symbol: { polygonFill: '#a855f7', polygonOpacity: 0.3, lineColor: '#9333ea', lineWidth: 2 } },
})
// 扇形
useMaptalksSector(layer, {
  coordinates: [121.497, 31.238],
  radius: 900,
  startAngle: 0,
  endAngle: 90,
  options: { symbol: { polygonFill: '#ef4444', polygonOpacity: 0.35, lineColor: '#dc2626', lineWidth: 2 } },
})

const status = computed(() => (isReady.value ? '地图已创建（四种规则图形）' : '加载中…'))
</script>
