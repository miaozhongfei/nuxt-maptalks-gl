<template>
  <div>
    <!-- 组合：组件建图 + 几何/相机 composable -->
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="11"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex gap-2 mt-3">
      <UButton size="sm" @click="fit">fitExtent 适配到多边形</UButton>
      <UButton size="sm" color="neutral" @click="cam.animateTo({ zoom: 11 })">缩小视野</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const { layer } = useMaptalksVectorLayer(map);
const { geometry } = useMaptalksPolygon(layer, {
  coordinates: [
    [[121.49, 31.24], [121.52, 31.24], [121.52, 31.255], [121.49, 31.255], [121.49, 31.24]],
  ],
  options: { symbol: { polygonFill: '#16a34a', polygonOpacity: 0.3, lineColor: '#15803d', lineWidth: 2 } },
});
const cam = useMaptalksCamera(map);
function fit() {
  const g = toValue(geometry) as { getExtent?: () => unknown } | null;
  const ext = g?.getExtent?.();
  if (ext) cam.fitExtent(ext, 0);
}
</script>
