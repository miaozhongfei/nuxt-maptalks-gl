<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// Circle
useMaptalksGeometry(layer, (mt) =>
  new mt.Circle([121.502, 31.248], 300, {
    symbol: { lineColor: '#dc2626', lineWidth: 2, polygonFill: '#ef4444', polygonOpacity: 0.3 },
    editable: true,
  }),
);
// Ellipse
useMaptalksGeometry(layer, (mt) =>
  new mt.Ellipse([121.51, 31.248], 400, 200, {
    symbol: { lineColor: '#2563eb', lineWidth: 2, polygonFill: '#3b82f6', polygonOpacity: 0.3 },
    editable: true,
  }),
);
// Rectangle
useMaptalksGeometry(layer, (mt) =>
  new mt.Rectangle([121.502, 31.24], 400, 300, {
    symbol: { lineColor: '#22c55e', lineWidth: 2, polygonFill: '#4ade80', polygonOpacity: 0.3 },
    editable: true,
  }),
);
</script>
