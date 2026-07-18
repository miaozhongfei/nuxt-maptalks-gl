<template>
  <div>
    <!-- 组合：组件建图（含初始视角），滑杆经 useMaptalksCamera 双向同步 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[-0.113049, 51.498568]"
      :zoom="14"
      :pitch="45"
      :bearing="-30"
      base-layer="osm"
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
// 组件与 composable 桥接
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
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
