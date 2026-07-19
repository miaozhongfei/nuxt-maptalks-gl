<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      :pitch="45"
      :bearing="-30"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">初始 pitch 45°、bearing -30°；按住右键（或 Ctrl+左键）拖拽可继续调整。</p>
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
    <div class="flex gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="set(60, -45)">俯仰 60° · 旋转 -45°</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="set(30, 90)">俯仰 30° · 旋转 90°</UButton>
      <UButton size="sm" color="neutral" @click="set(0, 0)">复位</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// 经组件 expose 的 map 桥接给相机 composable——只读角度，写回由滑杆/按钮驱动
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
const pitch = computed({
  get: () => cam.pitch.value ?? 0,
  set: (v) => { cam.pitch.value = v; },
});
const bearing = computed({
  get: () => cam.bearing.value ?? 0,
  set: (v) => { cam.bearing.value = v; },
});
function set(p: number, b: number) { pitch.value = p; bearing.value = b; }
</script>
