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
useMaptalksGeometry(layer, (mt) => new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
  symbol: { lineColor: '#2563eb', lineWidth: 3 },
}))
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 12, markerHeight: 12 },
}))
// 组合样式 Marker（同心圆波纹，逃生舱）
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5457, 31.2453], {
  symbol: [
    { markerType: 'ellipse', markerFill: '#fff', markerFillOpacity: 1, markerWidth: 20, markerHeight: 20, markerLineWidth: 0 },
    { markerType: 'ellipse', markerFill: '#1bc8ff', markerFillOpacity: 0.9, markerWidth: 55, markerHeight: 55, markerLineWidth: 0 },
    { markerType: 'ellipse', markerFill: '#0096cd', markerFillOpacity: 0.8, markerWidth: 91, markerHeight: 91, markerLineWidth: 0 },
    { markerType: 'ellipse', markerFill: '#0096cd', markerFillOpacity: 0.3, markerWidth: 130, markerHeight: 130, markerLineWidth: 0 },
    { markerType: 'ellipse', markerFill: '#0096cd', markerFillOpacity: 0.2, markerWidth: 172, markerHeight: 172, markerLineWidth: 0 },
  ],
}))

const status = computed(() => (isReady.value ? '地图已创建（组合样式）' : '加载中…'))
</script>
