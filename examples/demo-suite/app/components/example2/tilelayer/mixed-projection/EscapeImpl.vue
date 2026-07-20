<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const sr4326 = { projection: 'EPSG:4326' };
const gibsOptions = {
  urlTemplate:
    'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/{z}/{y}/{x}.jpeg',
  maxAvailableZoom: 8,
  attribution: '© NASA GIBS',
};
// 不同投影叠加：3857 瓦片挂到 4326 地图上，由图层级 spatialReference 声明差异
const cartoOn4326 = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  opacity: 0.6,
  spatialReference: { projection: 'EPSG:3857' },
};

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 5,
  spatialReference: sr4326,
});
// 工厂回调注入 maptalks-gl 命名空间（mt），创建 4326 底图
useMaptalksLayer(map, (mt) => new mt.TileLayer('base', gibsOptions));
// 叠加层：carto 3857 瓦片，图层级 spatialReference 声明不同投影，自动重投影
useMaptalksLayer(
  map,
  (mt) => new mt.TileLayer('carto-3857', cartoOn4326),
);
</script>
