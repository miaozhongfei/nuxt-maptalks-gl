<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksTileLayer :options="tileOptions" />
    </MaptalksMap>
    <p class="text-sm mt-2 text-muted">
      cssFilter: 'sepia(90%) invert(90%)' 静态暗色反转风格
    </p>
  </div>
</template>

<script setup lang="ts">
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  // cssFilter 静态叠加 sepia+invert 实现暗色反转风格
  cssFilter: 'sepia(90%) invert(90%)',
};
</script>
