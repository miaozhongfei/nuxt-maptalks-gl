<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      用 proj4 定义 UTM 50N（EPSG:32650）投影对象接入 spatialReference；几何以经纬度输入、按 UTM 平面渲染。
    </p>
  </div>
</template>

<script setup lang="ts">
import proj4 from 'proj4';

const el = ref<HTMLElement | null>(null);

// proj4 双向转换器：EPSG:4326 <-> EPSG:32650（UTM 50N，覆盖上海一带）
const utm = proj4('EPSG:4326', '+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs');

// maptalks 自定义投影对象：实现 project/unproject 即可作为 spatialReference.projection
const utmProjection = {
  code: 'EPSG:32650',
  project: (c: { x: number; y: number }) => {
    const [x, y] = utm.forward([c.x, c.y]);
    return { x, y };
  },
  unproject: (c: { x: number; y: number }) => {
    const [lng, lat] = utm.inverse([c.x, c.y]);
    return { x: lng, y: lat };
  },
};

// UTM 平面分辨率：从 ~1222m/px 逐级减半，共 10 级
const resolutions = Array.from({ length: 10 }, (_, i) => 1222.99 / 2 ** i);

const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 4,
  // 逃生舱：自定义投影对象 + 分辨率 + 全图范围（UTM 50N 米制坐标）
  spatialReference: {
    projection: utmProjection,
    resolutions,
    fullExtent: { top: 5000000, left: 100000, bottom: 3000000, right: 900000 },
  } as never,
});

// 平面下画几何验证投影生效（经纬度输入，内部经 project 转 UTM 米制）
const { layer } = useMaptalksVectorLayer(map);
useMaptalksMarker(layer, { coordinates: [121.5057, 31.2453], symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 16, markerHeight: 16 } });
useMaptalksCircle(layer, { coordinates: [121.5057, 31.2453], radius: 20000, symbol: { polygonFill: '#2563eb', polygonOpacity: 0.2, lineColor: '#1d4ed8', lineWidth: 2 } });
</script>
