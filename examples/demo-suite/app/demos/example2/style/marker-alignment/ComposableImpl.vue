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
// markerDx/markerDy 偏移 Marker 渲染锚点
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16, markerDx: 15, markerDy: 15 },
});
</script>
