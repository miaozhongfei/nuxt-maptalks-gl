<template>
  <div>
    <!-- 组合：组件建图 + camera zoom 双向滑杆 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
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
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
const zoom = computed({
  get: () => cam.zoom.value ?? 14,
  set: (v) => {
    cam.zoom.value = v;
  },
});
</script>
