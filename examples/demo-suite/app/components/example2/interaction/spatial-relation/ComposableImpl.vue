<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UBadge variant="subtle" class="mt-2">点击坐标: {{ status }}</UBadge>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const rect = [[[121.49, 31.26], [121.52, 31.26], [121.52, 31.23], [121.49, 31.23], [121.49, 31.26]]] as [number, number][][]
const { geometry: polygon } = useMaptalksPolygon(layer, {
  coordinates: rect,
  options: { symbol: { lineColor: '#2563eb', lineWidth: 2, polygonFill: '#3b82f6', polygonOpacity: 0.2 } },
})
useMaptalksMarker(layer, { coordinates: [121.50, 31.245], options: { symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 14, markerHeight: 14 } } })
useMaptalksMarker(layer, { coordinates: [121.53, 31.26], options: { symbol: { markerType: 'ellipse', markerFill: '#ef4444', markerWidth: 14, markerHeight: 14 } } })

const status = ref('点击地图')

useMaptalksEvents(map, {
  click: (e: unknown) => {
    const ev = e as { containerPoint: { x: number; y: number } }
    status.value = toValue(polygon)?.containsPoint(ev.containerPoint) ? '内' : '外'
  },
})
</script>
