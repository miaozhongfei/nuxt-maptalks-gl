<template>
  <div>
    <!-- 组合：组件建图 + camera composable 改缩放范围 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="cam.setZoomRange(12, 16)">限制 12 ~ 16</UButton>
      <UButton size="sm" color="neutral" @click="cam.setZoomRange(1, 19)">解除限制</UButton>
      <span class="text-sm text-muted">当前缩放 {{ (cam.zoom.value ?? 0).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
</script>
