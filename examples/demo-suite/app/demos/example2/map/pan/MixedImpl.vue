<template>
  <div>
    <!-- 组合：组件建图 + camera composable 平移 -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="cam.panTo([121.4906, 31.2397])">panTo 外滩</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="cam.panBy([150, 0])">panBy 右移 150px</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="cam.panBy([0, -120])">panBy 上移 120px</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="cam.animateTo({ center: [121.52, 31.235] })">setCenter 瞬移</UButton>
      <UButton size="sm" color="neutral" @click="cam.panTo([121.5057, 31.2453])">回到原点</UButton>
      <span class="text-sm text-muted">
        中心：{{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件与 composable 桥接
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const cam = useMaptalksCamera(map);
</script>
