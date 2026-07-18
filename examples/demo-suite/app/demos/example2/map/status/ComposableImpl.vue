<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <!-- 相机 ref 实时回流：拖拽/缩放地图，下面数字跟着变 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
      <div class="rounded border border-default p-2">中心<br>{{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}</div>
      <div class="rounded border border-default p-2">缩放<br>{{ (cam.zoom.value ?? 0).toFixed(2) }}</div>
      <div class="rounded border border-default p-2">俯仰<br>{{ (cam.pitch.value ?? 0).toFixed(1) }}°</div>
      <div class="rounded border border-default p-2">旋转<br>{{ (cam.bearing.value ?? 0).toFixed(1) }}°</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
// 四个状态 ref 自动跟随地图（moveend/zoomend/pitch/rotate）
const cam = useMaptalksCamera(map);
</script>
