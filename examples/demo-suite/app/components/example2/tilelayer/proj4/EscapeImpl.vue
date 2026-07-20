<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      用 proj4 定义 UTM 50N（EPSG:32650）投影对象接入 spatialReference；几何以经纬度输入、按 UTM 平面渲染。
      投影对象的 project/unproject 必须返回 maptalks 的 Coordinate 实例，故本例完全手动建图。
    </p>
  </div>
</template>

<script setup lang="ts">
import proj4 from 'proj4';

const el = ref<HTMLElement | null>(null);

// 手动托管的地图实例（本例投影对象依赖 maptalks 的 Coordinate 类，需先拿到命名空间再建图）
let mapInstance: { remove: () => void } | null = null;

onMounted(async () => {
  // 逃生舱：动态 import 拿完整命名空间（含 Coordinate 构造器）
  const mt = await import('maptalks-gl');
  if (!el.value) return;

  // proj4 双向转换器：EPSG:4326 <-> EPSG:32650（UTM 50N，覆盖上海一带）
  const utm = proj4('EPSG:4326', '+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs');

  // maptalks 自定义投影对象：project/unproject 必须返回 Coordinate 实例（内部会调用 .equals 等方法）
  const utmProjection = {
    code: 'EPSG:32650',
    project: (c: { x: number; y: number }) => {
      const [x, y] = utm.forward([c.x, c.y]);
      return new mt.Coordinate(x ?? 0, y ?? 0);
    },
    unproject: (c: { x: number; y: number }) => {
      const [lng, lat] = utm.inverse([c.x, c.y]);
      return new mt.Coordinate(lng ?? 0, lat ?? 0);
    },
  };

  // UTM 平面分辨率：从 ~1222m/px 逐级减半，共 10 级
  const resolutions = Array.from({ length: 10 }, (_, i) => 1222.99 / 2 ** i);

  const map = new mt.Map(el.value, {
    center: [121.5057, 31.2453],
    zoom: 4,
    // 自定义投影对象 + 分辨率 + 全图范围（UTM 50N 米制坐标）
    spatialReference: {
      projection: utmProjection,
      resolutions,
      fullExtent: { top: 5000000, left: 100000, bottom: 3000000, right: 900000 },
    },
  } as never);
  mapInstance = map as unknown as { remove: () => void };

  // 平面下画几何验证投影生效（经纬度输入，内部经 project 转 UTM 米制）
  const layer = new mt.VectorLayer('v');
  layer.addGeometry(
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 16, markerHeight: 16 },
    }),
  );
  layer.addGeometry(
    new mt.Circle([121.5057, 31.2453], 20000, {
      symbol: { polygonFill: '#2563eb', polygonOpacity: 0.2, lineColor: '#1d4ed8', lineWidth: 2 },
    }),
  );
  (layer as unknown as { addTo: (m: unknown) => void }).addTo(map);
});

// 手动建图必须手动销毁，避免 WebGL 上下文泄漏
onBeforeUnmount(() => {
  mapInstance?.remove();
  mapInstance = null;
});
</script>
