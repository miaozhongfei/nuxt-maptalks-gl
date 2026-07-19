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
// 陆家嘴周边多面（两个小方块）
useMaptalksMultiPolygon(layer, {
  coordinates: [
    [[[121.49, 31.236], [121.50, 31.236], [121.50, 31.244], [121.49, 31.244], [121.49, 31.236]]],
    [[[121.512, 31.248], [121.522, 31.248], [121.522, 31.256], [121.512, 31.256], [121.512, 31.248]]],
  ],
  symbol: { polygonFill: '#14b8a6', polygonOpacity: 0.35, lineColor: '#0d9488', lineWidth: 2 },
});
</script>
