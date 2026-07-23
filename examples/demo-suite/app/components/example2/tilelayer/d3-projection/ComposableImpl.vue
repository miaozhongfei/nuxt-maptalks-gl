<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      d3-geo 的 geoAzimuthalEqualArea 投影包装为 maptalks 投影对象；几何按方位等积投影渲染。
    </p>
  </div>
</template>

<script setup lang="ts">
import { geoAzimuthalEqualArea } from 'd3-geo';

const el = ref<HTMLElement | null>(null);

// d3 投影实例：缩放到米级量纲便于配 resolutions
const d3proj = geoAzimuthalEqualArea().scale(6378137).translate([0, 0]);

// 自定义 projection 对象：c.constructor 获取 Coordinate 类，无需提前 import
const d3Projection = {
  code: 'd3-azimuthal-equal-area',
  project: (c: { x: number; y: number; constructor: new (x: number, y: number) => unknown }) => {
    const r = d3proj([c.x, c.y]) ?? [0, 0];
    // d3 y 轴向下，取反适配 maptalks 坐标系
    return new c.constructor(r[0], -r[1]);
  },
  unproject: (pc: { x: number; y: number; constructor: new (x: number, y: number) => unknown }) => {
    const r = d3proj.invert?.([pc.x, -pc.y]) ?? [0, 0];
    return new pc.constructor(r[0] ?? 0, r[1] ?? 0);
  },
};

const resolutions = Array.from({ length: 8 }, (_, i) => 100000 / 2 ** i);

const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 1,
  spatialReference: {
    projection: d3Projection,
    resolutions,
    fullExtent: { top: 10018754, left: -10018754, bottom: -10018754, right: 10018754 },
  },
} as never);

// 画经线/纬线 + 标记验证投影形变
const { layer } = useMaptalksVectorLayer(map);
useMaptalksLineString(layer, {
  coordinates: [[-120, 0], [-60, 0], [0, 0], [60, 0], [120, 0]],
  symbol: { lineColor: '#dc2626', lineWidth: 2 },
});
useMaptalksLineString(layer, {
  coordinates: [[0, -60], [0, 0], [0, 60]],
  symbol: { lineColor: '#2563eb', lineWidth: 2 },
});
useMaptalksMarker(layer, {
  coordinates: [116.4, 39.9],
  symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 14, markerHeight: 14 },
});
</script>
