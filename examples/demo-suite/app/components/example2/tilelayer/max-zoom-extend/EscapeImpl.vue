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
const resolutions = Array.from({ length: 23 }, (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** i));
const srExtended = { projection: 'EPSG:3857', resolutions };
const tileOptions = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  maxAvailableZoom: 18,
};

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 20,
  spatialReference: srExtended,
});
useMaptalksLayer(map, (mt) => new mt.TileLayer('base', tileOptions));
const cam = useMaptalksCamera(map);
</script>
