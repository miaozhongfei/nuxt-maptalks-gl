<template>
  <div>
    <!-- 组合：组件建图 + camera composable 设置/解除限制 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[-0.113049, 51.498568]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="cam.setMaxExtent(EXT)">设置限制</UButton>
      <UButton size="sm" color="neutral" @click="cam.setMaxExtent(null)">解除限制</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const EXT = { xmin: -0.16, ymin: 51.48, xmax: -0.07, ymax: 51.52 };
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
</script>
