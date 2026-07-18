<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="14"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksTileLayer :options="tileOptions" />
  </MaptalksMap>
</template>

<script setup lang="ts">
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  // renderer: 'canvas' 强制瓦片图层走 Canvas 渲染
  renderer: 'canvas',
};
</script>
