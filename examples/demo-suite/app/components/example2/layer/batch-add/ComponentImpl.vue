<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker
          v-for="(pt, i) in pts"
          :key="i"
          :coordinates="pt"
          :symbol="{ markerType: 'ellipse', markerFill: colors[i % colors.length], markerWidth: 14, markerHeight: 14 }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-sm mt-2 text-muted">5 个 Marker 批量声明于同一 VectorLayer</p>
  </div>
</template>

<script setup lang="ts">
const pts: [number, number][] = [
  [121.4957, 31.2453],
  [121.5057, 31.2553],
  [121.5157, 31.2453],
  [121.5057, 31.2353],
  [121.5057, 31.2453],
];
const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];
</script>
