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
  linePatternAnimSpeed: 1,
  symbol: { lineColor: '#dc2626', lineWidth: 6, linePatternFile: 'https://cdn.maptalks.com/maptalks/img/pattern/arrow.png' },
}));
</script>
