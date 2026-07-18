<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-6 mt-3 flex-wrap">
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-20 shrink-0">俯仰 {{ pitch.toFixed(0) }}°</span>
        <USlider v-model="pitch" :min="0" :max="70" :step="1" />
      </div>
      <div class="flex items-center gap-2 w-72">
        <span class="text-sm w-20 shrink-0">旋转 {{ bearing.toFixed(0) }}°</span>
        <USlider v-model="bearing" :min="-180" :max="180" :step="1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 14,
  pitch: 45,
  bearing: -30,
});
useMaptalksTileLayer(map, { source: 'osm' });

// 相机双向同步：写 ref 即写回地图；拖动地图也会回流到 ref
const cam = useMaptalksCamera(map);
const pitch = computed({
  get: () => cam.pitch.value ?? 0,
  set: (v) => {
    cam.pitch.value = v;
  },
});
const bearing = computed({
  get: () => cam.bearing.value ?? 0,
  set: (v) => {
    cam.bearing.value = v;
  },
});
</script>
