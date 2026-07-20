<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="12"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksTileLayer :options="tileOptions" />
  </MaptalksMap>
</template>

<script setup lang="ts">
const tileOptions = {
  // {z}/{y}/{x} 顺序已在 URL 里
  urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  attribution: '© Esri',
};
</script>
