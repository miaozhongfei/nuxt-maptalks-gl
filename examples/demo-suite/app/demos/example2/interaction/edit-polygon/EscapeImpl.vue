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
useMaptalksGeometry(layer, (mt) =>
  new mt.Polygon(
    [[[121.49, 31.255], [121.52, 31.255], [121.52, 31.238], [121.49, 31.238], [121.49, 31.255]]],
    { symbol: { lineColor: '#2563eb', lineWidth: 3, polygonFill: '#22c55e', polygonOpacity: 0.3 }, editable: true },
  ),
);
</script>
