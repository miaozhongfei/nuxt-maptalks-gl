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
// 陆家嘴周边多线（工厂模式）
useMaptalksGeometry(layer, (mt) => new mt.MultiLineString([[[121.49, 31.235], [121.50, 31.243]], [[121.51, 31.248], [121.52, 31.255]]], {
  symbol: { lineColor: '#7c3aed', lineWidth: 3 },
}));
</script>
