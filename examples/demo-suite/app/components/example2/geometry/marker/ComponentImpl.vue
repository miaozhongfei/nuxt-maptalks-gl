<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 陆家嘴点标注 -->
      <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="markerOptions" />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
<script setup lang="ts">
const markerOptions: MaptalksMarkerOptions = {
  symbol: {
    markerType: 'ellipse',
    markerFill: '#2563eb',
    markerWidth: 18,
    markerHeight: 18,
  },
};
</script>
