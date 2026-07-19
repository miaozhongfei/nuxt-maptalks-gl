<template>
  <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <MaptalksGeoJSON :data="geojson" />
  </MaptalksMap>
  <p class="text-sm text-muted mt-2">组件方式：GeoJSON Point 转换为 Marker（对应官网 11.1）。</p>
</template>

<script setup lang="ts">
const geojson = { type: 'Point', coordinates: [121.5057, 31.2453] }
</script>
