<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm mt-2 text-muted">globalCompositeOperation: 'xor' — 重叠区域反色</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 底层：正常叠加
const { layer: bottomLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(bottomLayer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 30, markerHeight: 30 } },
});

// 上层：xor 混合模式，使用逃生舱工厂
const { layer: topLayer } = useMaptalksLayer(
  map,
  (mt) => new mt.VectorLayer('xor-layer', { globalCompositeOperation: 'xor' }),
);
useMaptalksGeometry(topLayer, (mt) => new mt.Marker(
  [121.5055, 31.2451],
  { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 30, markerHeight: 30 } },
));
</script>
