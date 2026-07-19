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
useMaptalksGeometry(layer, (mt) => new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
  symbol: { lineColor: '#2563eb', lineWidth: 2 },
}));
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.49, 31.235], {
  symbol: { markerType: 'bar', markerWidth: 6, markerHeight: 16, markerFill: '#2563eb', markerPlacement: 'vertex-first', markerRotation: 'auto' },
}));
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.52, 31.252], {
  symbol: { markerType: 'bar', markerWidth: 6, markerHeight: 16, markerFill: '#2563eb', markerPlacement: 'vertex-last', markerRotation: 'auto' },
}));
</script>
