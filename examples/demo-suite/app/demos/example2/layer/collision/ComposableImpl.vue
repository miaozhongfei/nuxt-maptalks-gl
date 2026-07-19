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

// 开启碰撞检测的矢量图层
const { layer } = useMaptalksVectorLayer(map, {
  options: { collision: true },
});

// 3 个同坐标不同颜色的 Marker，碰撞检测自动避让
const colors = ['#2563eb', '#dc2626', '#16a34a'];
colors.forEach((c) => {
  useMaptalksMarker(layer, {
    coordinates: [121.5057, 31.2453] as [number, number],
    symbol: { markerType: 'ellipse', markerFill: c, markerWidth: 18, markerHeight: 18 },
  });
});
</script>
