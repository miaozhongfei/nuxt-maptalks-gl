<template>
  <div>
    <!-- 组合：组件开启拖拽（开关驱动 props）；相机 composable 实时显示角度 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      :drag-pitch="dragPitch"
      :drag-rotate="dragRotate"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-6 mt-3 flex-wrap">
      <USwitch v-model="dragPitch" label="dragPitch（右键拖拽俯仰）" />
      <USwitch v-model="dragRotate" label="dragRotate（右键拖拽旋转）" />
    </div>
    <p class="text-sm text-muted mt-2">
      按住右键（或 Ctrl+左键）拖拽。
      当前俯仰 {{ (cam.pitch.value ?? 0).toFixed(1) }}° · 旋转 {{ (cam.bearing.value ?? 0).toFixed(1) }}°
    </p>
  </div>
</template>

<script setup lang="ts">
// 两个开关热更新：MaptalksMap 组件内独立 watch 检测 prop 变化 → m.config()
const dragPitch = ref(true);
const dragRotate = ref(true);
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
</script>
