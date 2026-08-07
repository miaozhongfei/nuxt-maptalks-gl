<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// EPSG:4326 经纬直投：地图与瓦片源都用 4326（NASA GIBS 500m 矩阵集，最大 8 级）
const sr4326 = { projection: 'EPSG:4326' }
const gibsOptions = {
  urlTemplate:
    'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/{z}/{y}/{x}.jpeg',
  maxAvailableZoom: 8,
  attribution: '© NASA GIBS',
}

const el = ref<HTMLElement | null>(null)
// spatialReference 直接进建图选项
const { map, isReady } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 5,
  spatialReference: sr4326,
})
useMaptalksTileLayer(map, { options: gibsOptions })

const status = computed(() => (isReady.value ? '地图已创建（4326 投影底图）' : '加载中…'))
</script>
