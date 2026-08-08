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

useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { draggable: true, symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } },
})
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.23], [121.5, 31.26], [121.52, 31.23]],
  options: { draggable: true, symbol: { lineColor: '#16a34a', lineWidth: 4 } },
})
useMaptalksPolygon(layer, {
  coordinates: [[[121.49, 31.238], [121.49, 31.252], [121.52, 31.252], [121.52, 31.238], [121.49, 31.238]]],
  options: { draggable: true, symbol: { polygonFill: '#2563eb', fillOpacity: 0.3, lineColor: '#1e40af', lineWidth: 2 } },
})

const status = computed(() => (isReady.value ? '地图已创建（图形可拖拽）' : '加载中…'))
</script>
