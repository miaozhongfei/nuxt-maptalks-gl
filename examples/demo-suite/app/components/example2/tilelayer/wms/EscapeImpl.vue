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
// 中心点例外：WMS 服务数据仅覆盖美国
const { map } = useMaptalks(el, { center: [-98, 39], zoom: 4 });
// OSM 底图
useMaptalksTileLayer(map, { source: 'osm' });
// 逃生舱：通过 useMaptalksLayer 工厂直接调用 maptalks-gl WMSTileLayer 构造器
const wmsOptions = {
  urlTemplate: 'https://ahocevar.com/geoserver/wms',
  layers: 'topp:states',
  format: 'image/png',
  transparent: true,
};
useMaptalksLayer(map, (mt) => new (mt as unknown as { WMSTileLayer: new (id: string, o: Record<string, unknown>) => MaptalksLayer }).WMSTileLayer('wms', wmsOptions));
</script>
