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
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
let geoRef: { setSymbol: (s: unknown) => void } | null = null;
const { geometry } = useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 26, markerHeight: 26 },
}));
watch(() => toValue(geometry), (geo) => {
  if (geo) geoRef = geo as unknown as { setSymbol: (s: unknown) => void };
});
// 监听 zoom 变化来更新 marker 大小
const cam = useMaptalksCamera(map);
watch(() => cam.zoom.value, (z) => {
  if (!geoRef || z === null || z === undefined) return;
  const size = z * 2;
  geoRef.setSymbol({ markerType: 'ellipse', markerFill: '#2563eb', markerWidth: size, markerHeight: size });
});
</script>
