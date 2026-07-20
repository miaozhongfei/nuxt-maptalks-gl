<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">当前 zoom：{{ (cam.zoom.value ?? 0).toFixed(2) }}（范围 0 ~ 5）</p>
  </div>
</template>

<script setup lang="ts">
// 自定义 LOD：仅 6 级分辨率（对应 Web 墨卡托 z10~z15，逐级减半）
const resolutions = Array.from(
  { length: 6 },
  (_, i) => (2 * 6378137 * Math.PI) / (256 * 2 ** (i + 10)),
);
const spatialReference = { projection: 'EPSG:3857', resolutions };

const el = ref<HTMLElement | null>(null);
// spatialReference 直接进建图选项
const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 3,
  spatialReference,
});
useMaptalksTileLayer(map, { source: 'osm' });
const cam = useMaptalksCamera(map);
</script>
