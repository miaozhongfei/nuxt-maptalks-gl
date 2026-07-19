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
// 连接线一体工厂：两个 Marker + 直连线 + 弧线
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v');
  // 窄化 cast 取未声明的构造器（ConnectorLine / ArcConnectorLine）
  const ConnectorLine = (mt as unknown as { ConnectorLine: new (s: MaptalksGeometry, t: MaptalksGeometry, o?: Record<string, unknown>) => MaptalksGeometry }).ConnectorLine;
  const ArcConnectorLine = (mt as unknown as { ArcConnectorLine: new (s: MaptalksGeometry, t: MaptalksGeometry, o?: Record<string, unknown>) => MaptalksGeometry }).ArcConnectorLine;
  // 起点 Marker（蓝色）
  const m1 = new mt.Marker([121.49, 31.24], {
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
  });
  // 终点 Marker（绿色）
  const m2 = new mt.Marker([121.52, 31.252], {
    symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 18, markerHeight: 18 },
  });
  const add = (g: unknown) => (layer as unknown as { addGeometry: (g: unknown) => void }).addGeometry(g);
  add(m1);
  add(m2);
  // ConnectorLine：直连线（始终显示）
  add(new ConnectorLine(m1, m2, {
    showOn: 'always',
    symbol: { lineColor: '#dc2626', lineWidth: 3 },
  }));
  // ArcConnectorLine：弧线连接（始终显示，弧度 60°）
  add(new ArcConnectorLine(m1, m2, {
    showOn: 'always',
    arcDegree: 60,
    symbol: { lineColor: '#7c3aed', lineWidth: 2 },
  }));
  return layer;
});
</script>
