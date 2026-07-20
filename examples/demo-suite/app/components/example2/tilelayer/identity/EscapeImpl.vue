<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
// IDENTITY 平面坐标系：无投影，直接以平面坐标渲染（常用于室内图/游戏地图）
const srIdentity = {
  projection: 'identity',
  resolutions: [32, 16, 8, 4, 2, 1],
  fullExtent: { top: 10000, left: -10000, bottom: -10000, right: 10000 },
};

const el = ref<HTMLElement | null>(null);
// 平面坐标无经纬度，中心点为 [0, 0]
const { map } = useMaptalks(el, {
  center: [0, 0],
  zoom: 2,
  spatialReference: srIdentity,
});
// 工厂回调注入 maptalks-gl 命名空间（mt），直接构造 VectorLayer + 原生几何
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('v');
  // Marker 中心点
  layer.addGeometry(new mt.Marker([0, 0]));
  // 蓝色半透明矩形
  layer.addGeometry(new mt.Rectangle([500, 500], 2000, 1200, {
    symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 },
  }));
  // 绿色半透明圆形
  layer.addGeometry(new mt.Circle([-1500, -800], 400, {
    symbol: { polygonFill: '#22c55e', polygonOpacity: 0.3, lineColor: '#16a34a', lineWidth: 2 },
  }));
  return layer;
});
</script>
