<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      d3-geo 的 geoAzimuthalEqualArea 投影包装为 maptalks 投影对象；几何按方位等积投影渲染。
      投影对象的 project/unproject 必须返回 maptalks 的 Coordinate 实例，故本例完全手动建图。
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { geoAzimuthalEqualArea } from 'd3-geo';

const el = ref<HTMLElement | null>(null);

// 手动托管的地图实例（投影对象依赖 maptalks 的 Coordinate 类，需先拿命名空间再建图）
let mapInstance: { remove: () => void } | null = null;
const ready = ref(false);

/** 画几条经纬线与标记验证投影形变（抽出以控制 onMounted 函数行数；addTo 已建模） */
function addDemoGeometries(mt: typeof import('maptalks-gl'), map: MaptalksMap): void {
  const layer = new mt.VectorLayer('v');
  layer.addGeometry(
    new mt.LineString(
      [
        [-120, 0],
        [-60, 0],
        [0, 0],
        [60, 0],
        [120, 0],
      ],
      { symbol: { lineColor: '#dc2626', lineWidth: 2 } },
    ),
  );
  layer.addGeometry(
    new mt.LineString(
      [
        [0, -60],
        [0, 0],
        [0, 60],
      ],
      { symbol: { lineColor: '#2563eb', lineWidth: 2 } },
    ),
  );
  layer.addGeometry(
    new mt.Marker([116.4, 39.9], {
      symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 14, markerHeight: 14 },
    }),
  );
  layer.addTo(map as any);
}

onMounted(async () => {
  // 逃生舱：动态 import 拿完整命名空间（含 Coordinate 构造器）
  const mt = await import('maptalks-gl');
  if (!el.value) return;

  // d3 投影实例：缩放到米级量纲便于配 resolutions
  const d3proj = geoAzimuthalEqualArea().scale(6378137).translate([0, 0]);

  // maptalks 自定义投影对象：project 输出平面坐标（注意 d3 的 y 轴向下，需取反）
  const d3Projection = {
    code: 'd3-azimuthal-equal-area',
    project: (c: { x: number; y: number }) => {
      const r = d3proj([c.x, c.y]) ?? [0, 0];
      return new mt.Coordinate(r[0], -r[1]);
    },
    unproject: (c: { x: number; y: number }) => {
      const r = d3proj.invert?.([c.x, -c.y]) ?? [0, 0];
      return new mt.Coordinate(r[0] ?? 0, r[1] ?? 0);
    },
  };

  const resolutions = Array.from({ length: 8 }, (_, i) => 100000 / 2 ** i);

  const map = new mt.Map(el.value, {
    center: [121.5057, 31.2453],
    zoom: 1,
    spatialReference: {
      projection: d3Projection,
      resolutions,
      fullExtent: { top: 10018754, left: -10018754, bottom: -10018754, right: 10018754 },
    },
  } as never);
  mapInstance = map as unknown as { remove: () => void };
  ready.value = true;

  addDemoGeometries(mt, map as any);
});

// 手动建图必须手动销毁，避免 WebGL 上下文泄漏
onBeforeUnmount(() => {
  mapInstance?.remove();
  mapInstance = null;
});

const status = computed(() => (ready.value ? '地图已创建（d3 方位等积投影）' : '加载中…'));
</script>
