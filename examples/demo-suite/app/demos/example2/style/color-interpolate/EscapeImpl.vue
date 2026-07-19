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
// 沿线等间距放置 5 个 Marker，颜色从红过渡到蓝
const positions: [number, number][] = [
  [121.49, 31.235],
  [121.4975, 31.24],
  [121.5057, 31.2453],
  [121.512, 31.249],
  [121.52, 31.252],
];
const colors = ['#dc2626', '#f59e0b', '#eab308', '#84cc16', '#2563eb'];
positions.forEach((pos, i) => {
  useMaptalksGeometry(layer, (mt) => new mt.Marker(pos, {
    symbol: { markerType: 'ellipse', markerFill: colors[i], markerWidth: 14, markerHeight: 14 },
  }));
});
// 同时画一条参考线
useMaptalksGeometry(layer, (mt) => new mt.LineString(positions, {
  symbol: { lineColor: '#6b7280', lineWidth: 1, lineDasharray: [4, 4] },
}));
</script>
