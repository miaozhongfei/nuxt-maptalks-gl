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

// 相机 zoom 双向 ref：滑杆写 0.1 步进的小数级别
const cam = useMaptalksCamera(map);
const zoom = computed({
  get: () => cam.zoom.value ?? 14,
  set: (v) => {
    cam.zoom.value = v;
  },
});
</script>
