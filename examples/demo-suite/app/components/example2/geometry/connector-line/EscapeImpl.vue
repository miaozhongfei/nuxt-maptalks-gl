<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
import type { MaptalksGeometry } from '@lacqjs/nuxt-maptalks-gl';

const SOURCE: [number, number] = [121.49, 31.24];
const TARGET: [number, number] = [121.52, 31.252];

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
// VectorLayer + Marker × 2 + ConnectorLine + ArcConnectorLine（一体工厂）
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v');
  // 窄化 cast 取未声明的连接线构造器
  const ConnectorLine = (mt as unknown as { ConnectorLine: new (s: MaptalksGeometry, t: MaptalksGeometry, o?: Record<string, unknown>) => MaptalksGeometry }).ConnectorLine;
  const ArcConnectorLine = (mt as unknown as { ArcConnectorLine: new (s: MaptalksGeometry, t: MaptalksGeometry, o?: Record<string, unknown>) => MaptalksGeometry }).ArcConnectorLine;
  // 起点 Marker（蓝色）
  const m1 = new mt.Marker(SOURCE, {
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
  });
  // 终点 Marker（绿色）
  const m2 = new mt.Marker(TARGET, {
    symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 18, markerHeight: 18 },
  });
  (layer as any).addGeometry(m1, m2);
  // ConnectorLine：直连线（始终显示）
  const line = new ConnectorLine(m1, m2, {
    showOn: 'always',
    symbol: { lineColor: '#dc2626', lineWidth: 3 },
  });
  // ArcConnectorLine：弧线连接（始终显示，弧度 60°）
  const arc = new ArcConnectorLine(m1, m2, {
    showOn: 'always',
    arcDegree: 60,
    symbol: { lineColor: '#7c3aed', lineWidth: 2 },
  });
  // setTimeout 延迟：factory 返回 → m.addLayer(layer) 同步执行后，连接线 getMap() 可用
  setTimeout(() => {
    (layer as any).addGeometry(line, arc);
  });
  return layer;
});
</script>
