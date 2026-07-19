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
// 工厂回调注入 maptalks-gl 命名空间（mt），创建底图
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
);
const { layer } = useMaptalksVectorLayer(map);
// 陆家嘴周边多面（工厂模式）
useMaptalksGeometry(layer, (mt) => new mt.MultiPolygon([
  [[[121.49, 31.236], [121.50, 31.236], [121.50, 31.244], [121.49, 31.244], [121.49, 31.236]]],
  [[[121.512, 31.248], [121.522, 31.248], [121.522, 31.256], [121.512, 31.256], [121.512, 31.248]]],
], {
  symbol: { polygonFill: '#14b8a6', polygonOpacity: 0.35, lineColor: '#0d9488', lineWidth: 2 },
}));
</script>
