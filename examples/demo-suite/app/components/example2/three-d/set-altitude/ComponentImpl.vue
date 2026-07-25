<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2 px-1">
      <span class="text-sm shrink-0">高度: {{ altitude }}m</span>
      <USlider v-model="altitude" :min="0" :max="800" :step="50" class="w-72" />
    </div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :pitch="55"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer :options="{ enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true }">
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ properties: { altitude }, symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const altitude = ref(500);
</script>
