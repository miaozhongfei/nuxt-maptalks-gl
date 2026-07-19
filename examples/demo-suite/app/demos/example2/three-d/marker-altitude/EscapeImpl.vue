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
// 逃生舱：直接 new 原生 VectorLayer + Marker，properties.altitude 表达高度
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
