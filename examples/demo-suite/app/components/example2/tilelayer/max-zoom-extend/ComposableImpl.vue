<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">当前 zoom：{{ (cam.zoom.value ?? 0).toFixed(2) }}（可超过默认 20 级上限）</p>
  </div>
</template>

<script setup lang="ts">
// 把空间参考扩到 22 级（默认 3857 预设为 0~20 级），瓦片源只有 18 级 → maxAvailableZoom 超采样放大
const resolutions = Array.from({ length: 23 }, (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** i));
const srExtended = { projection: 'EPSG:3857', resolutions };
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  // 超过 18 级后用 18 级瓦片放大渲染
  maxAvailableZoom: 18,
};

const el = ref<HTMLElement | null>(null);
// spatialReference 直接进建图选项
const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 20,
  spatialReference: srExtended,
});
useMaptalksTileLayer(map, { options: tileOptions });
const cam = useMaptalksCamera(map);
</script>
