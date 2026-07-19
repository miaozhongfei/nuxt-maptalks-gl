<template>
  <div>
    <!-- 组合：组件建图 + 相机 ref 实时状态 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      中心 {{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}
      · 缩放 {{ (cam.zoom.value ?? 0).toFixed(2) }}
      · 俯仰 {{ (cam.pitch.value ?? 0).toFixed(1) }}° · 旋转 {{ (cam.bearing.value ?? 0).toFixed(1) }}°
    </p>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
</script>
