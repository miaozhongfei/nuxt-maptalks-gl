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
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="blue" variant="soft" @click="blueLayer.value?.bringToFront?.()">蓝层置顶</UButton>
      <UButton size="xs" color="red" variant="soft" @click="redLayer.value?.bringToBack?.()">红层置底</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => mc.value?.map ?? null)

const { layer: blueLayer } = useMaptalksVectorLayer(map)
useMaptalksPolygon(blueLayer, {
  coordinates: [[[121.495, 31.252], [121.51, 31.252], [121.51, 31.238], [121.495, 31.238]]],
  options: { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.6, lineColor: '#1d4ed8', lineWidth: 2 } },
})

const { layer: redLayer } = useMaptalksVectorLayer(map)
useMaptalksPolygon(redLayer, {
  coordinates: [[[121.5, 31.25], [121.515, 31.25], [121.515, 31.24], [121.5, 31.24]]],
  options: { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.6, lineColor: '#b91c1c', lineWidth: 2 } },
})
</script>
