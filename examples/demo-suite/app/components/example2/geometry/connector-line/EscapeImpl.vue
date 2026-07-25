<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
/** 计算两点间的二次贝塞尔曲线点列（模拟弧线） */
function arcPoints(from: [number, number], to: [number, number], numPoints = 20): [number, number][] {
  const mx = (from[0] + to[0]) / 2;
  const my = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * len * 0.4;
  const cy = my + (dx / len) * len * 0.4;
  const pts: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * cx + t * t * to[0];
    const y = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * cy + t * t * to[1];
    pts.push([x, y]);
  }
  return pts;
}

const SOURCE: [number, number] = [121.49, 31.24];
const TARGET: [number, number] = [121.52, 31.252];

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
// 一体工厂：VectorLayer + Marker × 2 + 直连线 + 弧线
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v');
  // 起点 Marker（蓝色）
  const m1 = new mt.Marker(SOURCE, {
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
  });
  // 终点 Marker（绿色）
  const m2 = new mt.Marker(TARGET, {
    symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 18, markerHeight: 18 },
  });
  layer.addGeometry(m1);
  layer.addGeometry(m2);
  // 直连线
  layer.addGeometry(new mt.LineString([SOURCE, TARGET], {
    symbol: { lineColor: '#dc2626', lineWidth: 3 },
  }));
  // 弧线（二次贝塞尔逼近）
  layer.addGeometry(new mt.LineString(arcPoints(SOURCE, TARGET), {
    symbol: { lineColor: '#7c3aed', lineWidth: 2 },
  }));
  return layer;
});
</script>
