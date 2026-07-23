<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="12"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksTileLayer :options="tileOptions" />
  </MaptalksMap>
</template>

<script setup lang="ts">
// 天地图影像 WMTS（EPSG:3857 Web 墨卡托）
const tileOptions = {
  urlTemplate: 'https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=46680d606754c1da1972f835f4cb83d6',
  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
  attribution: '© 天地图',
};
</script>
