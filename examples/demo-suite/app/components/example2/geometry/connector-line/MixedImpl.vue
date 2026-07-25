<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.2453]"
    :zoom="13"
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
  // 控制点 = 中点 + 垂直方向偏移（产生弧线弧度）
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

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// 起点 Marker（蓝色）
useMaptalksMarker(layer, {
  coordinates: SOURCE,
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } },
});
// 终点 Marker（绿色）
useMaptalksMarker(layer, {
  coordinates: TARGET,
  options: { symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 18, markerHeight: 18 } },
});
// 直连线
useMaptalksLineString(layer, {
  coordinates: [SOURCE, TARGET],
  options: { symbol: { lineColor: '#dc2626', lineWidth: 3 } },
});
// 弧线（二次贝塞尔逼近）
useMaptalksLineString(layer, {
  coordinates: arcPoints(SOURCE, TARGET),
  options: { symbol: { lineColor: '#7c3aed', lineWidth: 2 } },
});
</script>
