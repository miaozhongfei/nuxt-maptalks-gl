<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 w-96">
      <span class="text-sm w-24 shrink-0">zoom {{ zoom.toFixed(1) }}</span>
      <USlider v-model="zoom" :min="12" :max="17" :step="0.1" />
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
// 逃生舱：相机 ref 读取方向（拖动地图回流），set 方向走原生 setZoom 无动画
const cam = useMaptalksCamera(map);
const zoom = computed({
  get: () => cam.zoom.value ?? 14,
  set: (v) => {
    const m = map.value as unknown as { setZoom: (z: number, o?: Record<string, unknown>) => void } | null;
    m?.setZoom(v, { animation: false });
  },
});
</script>
