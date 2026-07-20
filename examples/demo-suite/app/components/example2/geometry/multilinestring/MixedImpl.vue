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
// 陆家嘴周边多线
useMaptalksMultiLineString(layer, {
  coordinates: [[[121.49, 31.235], [121.50, 31.243]], [[121.51, 31.248], [121.52, 31.255]]],
  symbol: { lineColor: '#7c3aed', lineWidth: 3 },
});
</script>
