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
// 逃生舱：drawAltitude: true 在原生 VectorLayer 上自动绘制垂直高度线
useMaptalksLayer(map, (mt) => {
  const vl = new mt.VectorLayer('v', { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true });
  const geo = new mt.Marker([121.5057, 31.2453], {
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
    properties: { altitude: 500 },
  });
  vl.addGeometry(geo);
  return vl;
});
</script>
