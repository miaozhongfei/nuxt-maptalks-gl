<template>
  <div>
    <!-- 组合：组件开启拖拽；相机 composable 实时显示角度 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      :drag-pitch="true"
      :drag-rotate="true"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      按住右键拖拽。俯仰 {{ (cam.pitch.value ?? 0).toFixed(1) }}° · 旋转 {{ (cam.bearing.value ?? 0).toFixed(1) }}°
    </p>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
</script>
