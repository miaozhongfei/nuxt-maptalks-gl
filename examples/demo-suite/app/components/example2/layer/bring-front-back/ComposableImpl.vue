<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" variant="soft" @click="bringBlueFront">蓝层置顶</UButton>
      <UButton size="xs" color="error" variant="soft" @click="bringRedFront">红层置顶</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

const { layer: blueLayer } = useMaptalksVectorLayer(map)
useMaptalksPolygon(blueLayer, {
  coordinates: [[[121.495, 31.252], [121.51, 31.252], [121.51, 31.238], [121.495, 31.238]]],
  options: { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.8, lineColor: '#1d4ed8', lineWidth: 2 } },
})

const { layer: redLayer } = useMaptalksVectorLayer(map)
useMaptalksPolygon(redLayer, {
  coordinates: [[[121.5, 31.25], [121.515, 31.25], [121.515, 31.24], [121.5, 31.24]]],
  options: { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.8, lineColor: '#b91c1c', lineWidth: 2 } },
})

function bringBlueFront() { blueLayer.value?.bringToFront?.() }
function bringRedFront() { redLayer.value?.bringToFront?.() }
</script>
