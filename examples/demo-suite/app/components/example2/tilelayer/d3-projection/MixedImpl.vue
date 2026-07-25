<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="1"
      :options="{ spatialReference }"
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

const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const d3proj = geoAzimuthalEqualArea().scale(6378137).translate([0, 0]);
const d3Projection = {
  code: 'd3-azimuthal-equal-area',
  project: (c: { x: number; y: number; constructor: new (x: number, y: number) => unknown }) => {
    const r = d3proj([c.x, c.y]) ?? [0, 0];
    return new c.constructor(r[0], -r[1]);
  },
  unproject: (pc: { x: number; y: number; constructor: new (x: number, y: number) => unknown }) => {
    const r = d3proj.invert?.([pc.x, -pc.y]) ?? [0, 0];
    return new pc.constructor(r[0] ?? 0, r[1] ?? 0);
  },
};

const resolutions = Array.from({ length: 8 }, (_, i) => 100000 / 2 ** i);
const spatialReference = {
  projection: d3Projection,
  resolutions,
  fullExtent: { top: 10018754, left: -10018754, bottom: -10018754, right: 10018754 },
};

const { layer } = useMaptalksVectorLayer(map);
useMaptalksLineString(layer, {
  coordinates: [[-120, 0], [-60, 0], [0, 0], [60, 0], [120, 0]],
  options: { symbol: { lineColor: '#dc2626', lineWidth: 2 } },
});
useMaptalksLineString(layer, {
  coordinates: [[0, -60], [0, 0], [0, 60]],
  options: { symbol: { lineColor: '#2563eb', lineWidth: 2 } },
});
useMaptalksMarker(layer, {
  coordinates: [116.4, 39.9],
  options: { symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 14, markerHeight: 14 } },
});
</script>
