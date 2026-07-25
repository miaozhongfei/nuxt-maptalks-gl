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
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]],
  options: { symbol: { lineWidth: 8, lineGradientProperty: 'lineGradient' }, properties: { lineGradient: { type: 'linear', colorStops: [[0, '#dc2626'], [0.5, '#fbbf24'], [1, '#2563eb']] } } },
});
</script>
