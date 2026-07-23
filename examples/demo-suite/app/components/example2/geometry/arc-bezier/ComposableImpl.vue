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
// 圆弧和贝塞尔曲线一体工厂：三种曲线（ArcCurve / QuadBezierCurve / CubicBezierCurve）
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v');
  const ArcCurve = (mt as unknown as { ArcCurve: new (c: unknown, o?: Record<string, unknown>) => MaptalksGeometry }).ArcCurve;
  const QuadBezierCurve = (mt as unknown as { QuadBezierCurve: new (c: unknown, o?: Record<string, unknown>) => MaptalksGeometry }).QuadBezierCurve;
  const CubicBezierCurve = (mt as unknown as { CubicBezierCurve: new (c: unknown, o?: Record<string, unknown>) => MaptalksGeometry }).CubicBezierCurve;
  (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(
    new ArcCurve([[121.49, 31.238], [121.52, 31.252]], {
      symbol: { lineColor: '#2563eb', lineWidth: 3, arcDegree: 90 },
    }),
  );
  (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(
    new QuadBezierCurve([[121.488, 31.246], [121.503, 31.258], [121.518, 31.246]], {
      symbol: { lineColor: '#7c3aed', lineWidth: 3 },
    }),
  );
  (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(
    new CubicBezierCurve([[121.49, 31.232], [121.50, 31.242], [121.512, 31.228], [121.522, 31.24]], {
      symbol: { lineColor: '#dc2626', lineWidth: 3 },
    }),
  );
  return layer;
});
</script>
