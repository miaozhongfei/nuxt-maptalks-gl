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
useMaptalksPolygon(layer, {
  coordinates: [[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]],
  options: { symbol: { polygonFill: '#22c55e', polygonOpacity: 0.3, lineWidth: 2, polygonGradientProperty: 'gradient' }, properties: { gradient: { type: 'linear', colorStops: [[0, '#dc2626'], [0.5, '#fbbf24'], [1, '#2563eb']] } } },
});
</script>
