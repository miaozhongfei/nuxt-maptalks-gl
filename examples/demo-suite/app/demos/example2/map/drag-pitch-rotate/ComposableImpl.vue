<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      建图时开启 dragPitch / dragRotate；按住右键（或 Ctrl+左键）拖拽。
      当前俯仰 {{ (cam.pitch.value ?? 0).toFixed(1) }}° · 旋转 {{ (cam.bearing.value ?? 0).toFixed(1) }}°
    </p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
// 建图选项即开启拖拽倾斜/旋转
const { map } = useMaptalks(el, {
  center: [-0.113049, 51.498568],
  zoom: 14,
  dragPitch: true,
  dragRotate: true,
});
useMaptalksTileLayer(map, { source: 'osm' });
// 相机 ref 实时回流，直观看到拖拽效果
const cam = useMaptalksCamera(map);
</script>
