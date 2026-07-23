<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
import type { MaptalksLayer } from '@lacqjs/nuxt-maptalks-gl';

const el = ref<HTMLElement | null>(null);
// EPSG:4326 空间参考 + terrestris OSM-WMS 全球服务（对应官网 2.4）
const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 6,
  spatialReference: { projection: 'EPSG:4326' },
});
const wmsOptions = {
  urlTemplate: 'https://ows.terrestris.de/osm/service',
  tileSystem: [1, -1, -180, 90],
  crs: 'EPSG:4326',
  layers: 'OSM-WMS',
  version: '1.3.0',
  format: 'image/png',
  transparent: true,
  uppercase: true,
};
// 逃生舱：原生 WMSTileLayer 构造
useMaptalksLayer(
  map,
  (mt) =>
    new (mt as unknown as { WMSTileLayer: new (id: string, o: Record<string, unknown>) => MaptalksLayer }).WMSTileLayer(
      'wms',
      wmsOptions,
    ),
);
</script>
