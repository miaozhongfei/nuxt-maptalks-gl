<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">图层用自己的 6 级 LOD（z10~z15）取瓦片，地图缩放时自动就近匹配。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
// 图层专属 LOD：只保留 z10~z15 六级分辨率（与地图默认 LOD 不同）
const layerResolutions = Array.from(
  { length: 6 },
  (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** (i + 10)),
);
// TileLayer 自带 spatialReference：图层用自己的 LOD 取瓦片，地图缩放时自动就近匹配
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    spatialReference: { projection: 'EPSG:3857', resolutions: layerResolutions },
  },
});
</script>
