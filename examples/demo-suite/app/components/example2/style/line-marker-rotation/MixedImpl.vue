<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// markerPlacement: 'vertex' 在线的每个端点放置自动旋转的图片 Marker
useMaptalksLineString(layer, {
  coordinates: [[121.48, 31.23], [121.50, 31.25], [121.51, 31.24], [121.52, 31.26], [121.53, 31.245]],
  options: { symbol: { lineColor: '#1bbc9b', lineWidth: 3, lineDasharray: [10, 10], markerFile: '/images/plane.png', markerPlacement: 'vertex', markerVerticalAlignment: 'middle', markerWidth: 30, markerHeight: 30 } },
});
</script>
