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
    <p class="text-sm text-muted mt-2">图层用自己的 6 级 LOD（z10~z15）取瓦片，地图缩放时自动就近匹配。</p>
  </div>
</template>

<script setup lang="ts">
// 图层专属 LOD：只保留 z10~z15 六级分辨率（与地图默认 LOD 不同）
const layerResolutions = Array.from(
  { length: 6 },
  (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** (i + 10)),
);
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  // TileLayer 自带 spatialReference：图层用自己的 LOD 取瓦片，地图缩放时自动就近匹配
  spatialReference: { projection: 'EPSG:3857', resolutions: layerResolutions },
};
</script>
