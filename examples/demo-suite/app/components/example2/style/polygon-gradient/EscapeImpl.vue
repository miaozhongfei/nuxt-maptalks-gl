<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// linear 渐变
useMaptalksGeometry(layer, (mt) => new mt.Rectangle([121.485, 31.255], 600, 600, {
  symbol: { polygonFill: { type: 'linear', colorStops: [[0, '#fff'], [0.5, '#fff27e'], [1, '#f87e4b']] }, polygonOpacity: 1, lineColor: '#fff' },
}));
// linear + places 渐变
useMaptalksGeometry(layer, (mt) => new mt.Rectangle([121.493, 31.255], 600, 600, {
  symbol: { polygonFill: { type: 'linear', places: [0, 0, 1, 1], colorStops: [[0, '#fff'], [0.5, '#fff27e'], [1, '#f87e4b']] }, polygonOpacity: 1, lineColor: '#fff' },
}));
// radial 渐变
useMaptalksGeometry(layer, (mt) => new mt.Rectangle([121.5057, 31.2453], 600, 600, {
  symbol: { polygonFill: { type: 'radial', colorStops: [[0, 'rgba(216,115,149,0)'], [0.5, 'rgba(216,115,149,1)'], [1, 'rgba(216,115,149,1)']] }, polygonOpacity: 1, lineWidth: 0 },
}));
// radial + places 渐变
useMaptalksGeometry(layer, (mt) => new mt.Rectangle([121.513, 31.2453], 600, 600, {
  symbol: { polygonFill: { type: 'radial', places: [0.5, 0.5, 1, 1, 1, 0.1], colorStops: [[0, '#1bbc9b'], [0.55, 'rgb(135,196,240)'], [1, '#34495e']] }, polygonOpacity: 1, lineColor: '#fff' },
}));
</script>
