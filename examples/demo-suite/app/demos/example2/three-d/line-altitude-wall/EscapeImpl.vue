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
// 逃生舱：drawAltitude: true 在原生 VectorLayer 上自动生成垂直墙体
useMaptalksLayer(map, (mt) => {
  const vl = new mt.VectorLayer('v', { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true });
  const geo = new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
    symbol: { lineColor: '#dc2626', lineWidth: 3 },
    properties: { altitude: 400 },
  });
  vl.addGeometry(geo);
  return vl;
});
</script>
