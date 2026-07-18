<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
// 中心点例外：WMS 服务数据仅覆盖美国
const { map } = useMaptalks(el, { center: [-98, 39], zoom: 4 });
// OSM 底图
useMaptalksTileLayer(map, { source: 'osm' });
// 模块 WMS 预设 composable：叠加 ahocevar GeoServer topp:states 图层
const wmsOptions = {
  urlTemplate: 'https://ahocevar.com/geoserver/wms',
  layers: 'topp:states',
  format: 'image/png',
  transparent: true,
};
useMaptalksWMSLayer(map, { options: wmsOptions });
</script>
