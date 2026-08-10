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
const POLY_COORDS = [[[121.475, 31.253], [121.47, 31.245], [121.478, 31.24], [121.485, 31.248], [121.475, 31.253]]] as Array<Array<[number, number]>>
const LINE_COORDS = [[121.49, 31.253], [121.485, 31.245], [121.493, 31.24], [121.50, 31.248]] as Array<[number, number]>

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
// Polygon 原始（红色对比）
useMaptalksGeometry(layer, (mt) => new mt.Polygon([...POLY_COORDS], {
  symbol: { lineColor: '#f00', shadowBlur: 10, shadowOffsetX: 10, shadowOffsetY: 10 },
}))
// Polygon 平滑（smoothness: 0.5）
useMaptalksGeometry(layer, (mt) => new mt.Polygon([...POLY_COORDS], {
  smoothness: 0.5,
  symbol: { lineColor: '#34495e', lineWidth: 3 },
}))
// LineString 原始（红色对比）
useMaptalksGeometry(layer, (mt) => new mt.LineString([...LINE_COORDS], {
  symbol: { lineColor: '#f00', shadowBlur: 10, shadowOffsetX: 10, shadowOffsetY: 10 },
}))
// LineString 平滑（smoothness: 0.5）
useMaptalksGeometry(layer, (mt) => new mt.LineString([...LINE_COORDS], {
  smoothness: 0.5,
  symbol: { lineColor: '#34495e', lineWidth: 3 },
}))

const status = computed(() => (isReady.value ? '地图已创建（曲线平滑对比）' : '加载中…'))
</script>
