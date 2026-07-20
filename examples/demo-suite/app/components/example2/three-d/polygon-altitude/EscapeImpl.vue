<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 55 });
useMaptalksTileLayer(map, { source: 'osm' });
// 逃生舱：直接 new 原生 VectorLayer + Polygon，properties.altitude 表达高度
useMaptalksLayer(map, (mt) => {
  const vl = new mt.VectorLayer('v', { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true });
  const geo = new mt.Polygon([[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]], {
    symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 },
    properties: { altitude: 300 },
  });
  vl.addGeometry(geo);
  return vl;
});
</script>
