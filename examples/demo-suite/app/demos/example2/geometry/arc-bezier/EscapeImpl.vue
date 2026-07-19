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
// 工厂回调注入 maptalks-gl 命名空间（mt），创建底图
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
);
// 圆弧和贝塞尔曲线一体工厂：三种曲线（ArcCurve / QuadBezierCurve / CubicBezierCurve）
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v');
  // 窄化 cast 取未声明的构造器（ArcCurve / QuadBezierCurve / CubicBezierCurve）
  const ArcCurve = (mt as unknown as { ArcCurve: new (c: unknown, o?: Record<string, unknown>) => MaptalksGeometry }).ArcCurve;
  const QuadBezierCurve = (mt as unknown as { QuadBezierCurve: new (c: unknown, o?: Record<string, unknown>) => MaptalksGeometry }).QuadBezierCurve;
  const CubicBezierCurve = (mt as unknown as { CubicBezierCurve: new (c: unknown, o?: Record<string, unknown>) => MaptalksGeometry }).CubicBezierCurve;
  // ArcCurve：圆弧曲线（两点 + 弧度）
  (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(
    new ArcCurve([[121.49, 31.238], [121.52, 31.252]], {
      symbol: { lineColor: '#2563eb', lineWidth: 3, arcDegree: 90 },
    }),
  );
  // QuadBezierCurve：二次贝塞尔曲线（三点：起点 + 控制点 + 终点）
  (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(
    new QuadBezierCurve([[121.488, 31.246], [121.503, 31.258], [121.518, 31.246]], {
      symbol: { lineColor: '#7c3aed', lineWidth: 3 },
    }),
  );
  // CubicBezierCurve：三次贝塞尔曲线（四点：起点 + 两控制点 + 终点）
  (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(
    new CubicBezierCurve([[121.49, 31.232], [121.50, 31.242], [121.512, 31.228], [121.522, 31.24]], {
      symbol: { lineColor: '#dc2626', lineWidth: 3 },
    }),
  );
  return layer;
});
</script>
