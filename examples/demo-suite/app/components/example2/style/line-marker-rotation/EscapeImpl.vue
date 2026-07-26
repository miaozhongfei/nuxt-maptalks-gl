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
// markerPlacement: 'vertex' 在每个端点自动放置并旋转 plane.png
useMaptalksGeometry(layer, (mt) => new mt.LineString([[121.48, 31.23], [121.50, 31.25], [121.51, 31.24], [121.52, 31.26], [121.53, 31.245]], {
  symbol: { lineColor: '#1bbc9b', lineWidth: 3, lineDasharray: [10, 10], markerFile: '/images/plane.png', markerPlacement: 'vertex', markerVerticalAlignment: 'middle', markerWidth: 30, markerHeight: 30 },
}));
</script>
