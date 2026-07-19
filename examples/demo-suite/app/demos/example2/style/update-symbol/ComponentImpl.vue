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
          :coordinates="[121.5057, 31.2453]"
          :symbol="symbol"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="mt-3 flex gap-2">
      <UButton size="sm" color="destructive" @click="symbol.markerFill = '#dc2626'">切换红色</UButton>
      <UButton size="sm" color="primary" @click="symbol.markerFill = '#2563eb'">切换蓝色</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const symbol = ref({
  markerType: 'ellipse',
  markerFill: '#2563eb',
  markerWidth: 20,
  markerHeight: 20,
});
</script>
