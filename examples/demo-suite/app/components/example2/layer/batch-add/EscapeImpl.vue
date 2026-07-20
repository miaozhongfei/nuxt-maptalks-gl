<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2 text-muted">5 个 Marker 通过逃生舱工厂批量创建</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

const pts: [number, number][] = [
  [121.4957, 31.2453],
  [121.5057, 31.2553],
  [121.5157, 31.2453],
  [121.5057, 31.2353],
  [121.5057, 31.2453],
];
const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];

// 逃生舱工厂批量创建原生 Marker
pts.forEach((c, i) => {
  useMaptalksGeometry(layer, (mt) => new mt.Marker(
    c,
    { symbol: { markerType: 'ellipse', markerFill: colors[i % colors.length], markerWidth: 14, markerHeight: 14 } },
  ));
});
</script>
