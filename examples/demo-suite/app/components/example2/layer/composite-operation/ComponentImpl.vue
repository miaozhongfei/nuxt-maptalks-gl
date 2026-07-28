<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer :options="{ globalCompositeOperation: 'difference' }">
        <MaptalksMarker
          v-for="(m, i) in randomMarkers"
          :key="i"
          :coordinates="m.coord"
          :options="{ symbol: { markerType: 'ellipse', markerFill: m.color, markerFillOpacity: 1, markerLineWidth: 1, markerLineColor: m.color, markerWidth: 70, markerHeight: 70 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const colors = ['#f00', '#0f0', '#00f']
const randomMarkers = Array.from({ length: 50 }, () => {
  const x = 121.5057 + (Math.random() - 0.5) * 0.055 * 0.5
  const y = 31.2453 + (Math.random() - 0.5) * 0.03 * 0.5
  return { coord: [x, y] as [number, number], color: colors[Math.floor(Math.random() * 3)] }
})
</script>
