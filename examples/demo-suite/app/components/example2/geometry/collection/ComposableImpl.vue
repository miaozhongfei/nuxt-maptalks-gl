<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
import type { MaptalksGeometry } from '@lacqjs/nuxt-maptalks-gl';

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
// GeometryCollection 工厂：集合内混装 点/线/面 三种子几何
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v');
  const GC = (mt as unknown as { GeometryCollection: new (geos: unknown[], o?: Record<string, unknown>) => MaptalksGeometry }).GeometryCollection;
  const collection = new GC([
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
    }),
    new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
      symbol: { lineColor: '#dc2626', lineWidth: 3 },
    }),
    new mt.Polygon([[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]], {
      symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 },
    }),
  ]);
  (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(collection);
  return layer;
});
</script>
