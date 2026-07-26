<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const COORDS = [[121.48, 31.235], [121.49, 31.25], [121.505, 31.24], [121.52, 31.255], [121.535, 31.242]] as Array<[number, number]>;

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 原始折线（红色对比）
useMaptalksLineString(layer, {
  coordinates: COORDS,
  options: { symbol: { lineColor: '#f00', lineWidth: 3 } },
});
// 同一坐标点 + smoothness: 0.5 平滑
useMaptalksLineString(layer, {
  coordinates: COORDS,
  options: { smoothness: 0.5, symbol: { lineColor: '#34495e', lineWidth: 3 } },
});
</script>
