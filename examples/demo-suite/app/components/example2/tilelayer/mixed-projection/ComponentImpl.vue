<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="5"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      :options="{ spatialReference: sr4326 }"
    >
      <MaptalksTileLayer :options="gibsOptions" />
      <MaptalksTileLayer id="carto-3857" :options="cartoOn4326" />
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const sr4326 = { projection: 'EPSG:4326' }
const gibsOptions = {
  urlTemplate:
    'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/{z}/{y}/{x}.jpeg',
  maxAvailableZoom: 8,
  attribution: '© NASA GIBS',
}
// 不同投影叠加：3857 瓦片挂到 4326 地图上，由图层级 spatialReference 声明差异
const cartoOn4326 = {
  urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  subdomains: ['b', 'c', 'd'],
  opacity: 0.6,
  spatialReference: { projection: 'EPSG:3857' },
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（4326+3857 混合投影）' : '加载中…'))
</script>
