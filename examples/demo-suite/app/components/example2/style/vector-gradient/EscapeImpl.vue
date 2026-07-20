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
// 渐变填充：radial 渐变对象（gl 版可能降级为纯色 fill）
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: {
    markerType: 'ellipse',
    markerFill: { type: 'radial', colorStops: [[0, '#60a5fa'], [0.5, '#2563eb'], [1, '#1e3a8a']] },
    markerWidth: 30,
    markerHeight: 30,
  },
}));
</script>
