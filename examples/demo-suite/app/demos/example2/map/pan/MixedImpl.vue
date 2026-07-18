<template>
  <div>
    <!-- 组合：组件建图 + camera composable 平移 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[-0.113049, 51.498568]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="cam.panTo([-0.088, 51.505])">panTo 塔桥</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="cam.panBy([150, 0])">panBy 右移 150px</UButton>
      <UButton size="sm" color="neutral" @click="cam.panTo([-0.113049, 51.498568])">回到原点</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件与 composable 桥接
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
</script>
