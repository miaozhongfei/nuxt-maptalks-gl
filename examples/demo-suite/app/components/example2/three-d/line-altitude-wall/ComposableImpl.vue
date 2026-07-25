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
// 三维矢量图层：drawAltitude: true 自动生成从线到地面的垂直墙体
const { layer } = useMaptalksVectorLayer(map, { options: { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true } });
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]],
  options: { properties: { altitude: 400 }, symbol: { lineColor: '#dc2626', lineWidth: 3 } },
});
</script>
