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
// 三维矢量图层：drawAltitude: true 自动绘制 Marker 到地面的垂直高度线
const { layer } = useMaptalksVectorLayer(map, { options: { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true } });
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  properties: { altitude: 500 },
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
});
</script>
