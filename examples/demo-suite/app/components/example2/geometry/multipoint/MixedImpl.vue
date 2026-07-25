<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 陆家嘴周边多点标注
useMaptalksMultiPoint(layer, {
  coordinates: [[121.49, 31.24], [121.5057, 31.2453], [121.52, 31.25]],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 } },
});
</script>
