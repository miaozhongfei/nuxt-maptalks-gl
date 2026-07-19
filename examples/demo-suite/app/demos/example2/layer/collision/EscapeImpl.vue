<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2 text-muted">collision: true — 3 个同坐标 Marker 自动碰撞避让</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：工厂创建带 collision 的 VectorLayer
const { layer } = useMaptalksLayer(
  map,
  (mt) => new mt.VectorLayer('collision-layer', { collision: true }),
);

const colors = ['#2563eb', '#dc2626', '#16a34a'];
colors.forEach((c) => {
  useMaptalksGeometry(layer, (mt) => new mt.Marker(
    [121.5057, 31.2453],
    { symbol: { markerType: 'ellipse', markerFill: c, markerWidth: 18, markerHeight: 18 } },
  ));
});
</script>
