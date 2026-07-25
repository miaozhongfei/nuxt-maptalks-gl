<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// 渐变填充：radial 渐变对象（gl 版可能降级为纯色 fill）
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: {
    symbol: {
      markerType: 'ellipse',
      markerFill: {
        type: 'radial',
        colorStops: [
          [0, '#60a5fa'],
          [0.5, '#2563eb'],
          [1, '#1e3a8a'],
        ],
      },
      markerWidth: 300,
      markerHeight: 300,
    },
  },
});
</script>
