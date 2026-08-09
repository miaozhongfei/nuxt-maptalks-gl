<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const POLY_COORDS = [[[121.475, 31.253], [121.47, 31.245], [121.478, 31.24], [121.485, 31.248], [121.475, 31.253]]] as Array<Array<[number, number]>>
const LINE_COORDS = [[121.49, 31.253], [121.485, 31.245], [121.493, 31.24], [121.50, 31.248]] as Array<[number, number]>

const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksVectorLayer(map)
// Polygon 原始（红色对比）
useMaptalksPolygon(layer, {
  coordinates: POLY_COORDS,
  options: { symbol: { lineColor: '#f00', shadowBlur: 10, shadowOffsetX: 10, shadowOffsetY: 10 } },
})
// Polygon 平滑（smoothness: 0.5）
useMaptalksPolygon(layer, {
  coordinates: POLY_COORDS,
  options: { smoothness: 0.5, symbol: { lineColor: '#34495e', lineWidth: 3 } },
})
// LineString 原始（红色对比）
useMaptalksLineString(layer, {
  coordinates: LINE_COORDS,
  options: { symbol: { lineColor: '#f00', shadowBlur: 10, shadowOffsetX: 10, shadowOffsetY: 10 } },
})
// LineString 平滑（smoothness: 0.5）
useMaptalksLineString(layer, {
  coordinates: LINE_COORDS,
  options: { smoothness: 0.5, symbol: { lineColor: '#34495e', lineWidth: 3 } },
})

const status = computed(() => (map.value ? '地图已创建（曲线平滑对比）' : '加载中…'))
</script>
