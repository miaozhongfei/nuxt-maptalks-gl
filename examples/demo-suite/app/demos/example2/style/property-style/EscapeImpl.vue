<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.245], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// A 类 Marker
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.49, 31.24], {
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
  properties: { category: 'A' },
}));
// B 类 Marker
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.52, 31.25], {
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 18, markerHeight: 18 },
  properties: { category: 'B' },
}));
// 文字标签
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.49, 31.242], {
  symbol: { textName: 'A 类', textFill: '#2563eb', textSize: 14 },
}));
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.52, 31.252], {
  symbol: { textName: 'B 类', textFill: '#dc2626', textSize: 14 },
}));
</script>
