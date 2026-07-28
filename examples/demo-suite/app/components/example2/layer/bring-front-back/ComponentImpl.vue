<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer ref="blueRef">
        <MaptalksPolygon
          :coordinates="blueCoords"
          :options="{ symbol: { polygonFill: '#2563eb', polygonOpacity: 0.6, lineColor: '#1d4ed8', lineWidth: 2 } }"
        />
      </MaptalksVectorLayer>
      <MaptalksVectorLayer ref="redRef">
        <MaptalksPolygon
          :coordinates="redCoords"
          :options="{ symbol: { polygonFill: '#dc2626', polygonOpacity: 0.6, lineColor: '#b91c1c', lineWidth: 2 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="blue" variant="soft" @click="blueRef?.layer?.bringToFront?.()">蓝层置顶</UButton>
      <UButton size="xs" color="red" variant="soft" @click="redRef?.layer?.bringToBack?.()">红层置底</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const blueRef = ref<MaptalksVectorLayerExposed | null>(null)
const redRef = ref<MaptalksVectorLayerExposed | null>(null)

const blueCoords = [[[121.495, 31.252], [121.51, 31.252], [121.51, 31.238], [121.495, 31.238]]]
const redCoords = [[[121.5, 31.25], [121.515, 31.25], [121.515, 31.24], [121.5, 31.24]]]
</script>
