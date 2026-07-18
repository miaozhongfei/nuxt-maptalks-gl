<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="cam.setZoomRange(12, 16)">限制 12 ~ 16</UButton>
      <UButton size="sm" color="neutral" @click="cam.setZoomRange(1, 19)">解除限制</UButton>
      <span class="text-sm text-muted">当前缩放 {{ (cam.zoom.value ?? 0).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
// 建图时先给一组上下限
const { map } = useMaptalks(el, {
  center: [-0.113049, 51.498568],
  zoom: 14,
  minZoom: 12,
  maxZoom: 16,
});
useMaptalksTileLayer(map, { source: 'osm' });
// setZoomRange 是 camera composable 提供
const cam = useMaptalksCamera(map);
</script>
