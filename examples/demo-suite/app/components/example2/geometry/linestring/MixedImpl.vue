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
// 陆家嘴黄浦江东岸折线
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]],
  options: { symbol: { lineColor: '#dc2626', lineWidth: 3 } },
});
</script>
