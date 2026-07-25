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
// 陆家嘴世纪大道街区多边形
useMaptalksPolygon(layer, {
  coordinates: [[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]],
  options: { symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 } },
});
</script>
