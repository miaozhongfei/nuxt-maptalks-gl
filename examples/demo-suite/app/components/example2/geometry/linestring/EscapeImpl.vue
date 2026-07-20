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
// 陆家嘴黄浦江东岸折线（工厂模式）
useMaptalksGeometry(layer, (mt) => new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
  symbol: { lineColor: '#dc2626', lineWidth: 3 },
}));
</script>
