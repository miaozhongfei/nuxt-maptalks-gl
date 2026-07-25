<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 图形预设</h1>
    <p class="text-muted mb-6">
      演示全部 12 个几何预设 composable。它们都接收一个 <code>useMaptalksVectorLayer</code> 返回的图层，
      在其上响应式纳管一个几何。这里把 12 个几何全部加到同一张地图的同一个矢量图层上。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalks{Marker,LineString,Polygon,Multi*,Circle,Ellipse,Rectangle,Sector,Label,TextBox}</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 3.x</UBadge>
        </div>
      </template>
      <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
      <template #footer>
        <span class="text-sm text-muted">同一矢量图层上纳管了 12 个几何：点/线/面/Multi 系列/圆/椭圆/矩形/扇形/标签/文本框。</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// 命令式创建地图 + 一个矢量图层，随后用 12 个几何预设把几何加到该图层
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.48, 31.235], zoom: 12 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

// 点标记
useMaptalksMarker(layer, {
  coordinates: [121.47, 31.23],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } },
});
// 折线
useMaptalksLineString(layer, {
  coordinates: [[121.45, 31.22], [121.47, 31.235], [121.49, 31.22]],
  options: { symbol: { lineColor: '#dc2626', lineWidth: 3 } },
});
// 多边形
useMaptalksPolygon(layer, {
  coordinates: [[[121.44, 31.25], [121.46, 31.25], [121.46, 31.27], [121.44, 31.27], [121.44, 31.25]]],
  options: { symbol: { polygonFill: '#22c55e', polygonOpacity: 0.4, lineColor: '#16a34a', lineWidth: 2 } },
});
// 多点
useMaptalksMultiPoint(layer, {
  coordinates: [[121.45, 31.21], [121.47, 31.21], [121.49, 31.21]],
  options: { symbol: { markerType: 'ellipse', markerFill: '#0ea5e9', markerWidth: 14, markerHeight: 14 } },
});
// 多线
useMaptalksMultiLineString(layer, {
  coordinates: [[[121.44, 31.28], [121.46, 31.29]], [[121.47, 31.28], [121.49, 31.29]]],
  options: { symbol: { lineColor: '#7c3aed', lineWidth: 3 } },
});
// 多面
useMaptalksMultiPolygon(layer, {
  coordinates: [
    [[[121.5, 31.22], [121.51, 31.22], [121.51, 31.23], [121.5, 31.23], [121.5, 31.22]]],
    [[[121.52, 31.22], [121.53, 31.22], [121.53, 31.23], [121.52, 31.23], [121.52, 31.22]]],
  ],
  options: { symbol: { polygonFill: '#14b8a6', polygonOpacity: 0.4, lineColor: '#0d9488', lineWidth: 2 } },
});
// 圆
useMaptalksCircle(layer, {
  coordinates: [121.46, 31.24],
  radius: 600,
  options: { symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 } },
});
// 椭圆
useMaptalksEllipse(layer, {
  coordinates: [121.5, 31.25],
  width: 1400,
  height: 700,
  options: { symbol: { polygonFill: '#a855f7', polygonOpacity: 0.3, lineColor: '#9333ea', lineWidth: 2 } },
});
// 矩形
useMaptalksRectangle(layer, {
  coordinates: [121.43, 31.26],
  width: 1200,
  height: 800,
  options: { symbol: { polygonFill: '#f59e0b', polygonOpacity: 0.3, lineColor: '#d97706', lineWidth: 2 } },
});
// 扇形
useMaptalksSector(layer, {
  coordinates: [121.54, 31.245],
  radius: 900,
  startAngle: 0,
  endAngle: 90,
  options: { symbol: { polygonFill: '#ef4444', polygonOpacity: 0.35, lineColor: '#dc2626', lineWidth: 2 } },
});
// 文字标签
useMaptalksLabel(layer, {
  content: '文字标签 Label',
  coordinates: [121.485, 31.245],
  options: { symbol: { textFill: '#111827', textSize: 15 } },
});
// 文本框
useMaptalksTextBox(layer, {
  content: '文本框 TextBox',
  coordinates: [121.5, 31.28],
  width: 140,
  height: 40,
});
</script>
