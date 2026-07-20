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
      opacity: 0.5 静态半透明瓦片（深色页面背景可衬出半透明效果）
    </p>
  </div>
</template>

<script setup lang="ts">
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  // opacity 选项静态设置瓦片图层半透明
  opacity: 0.5,
};
</script>
