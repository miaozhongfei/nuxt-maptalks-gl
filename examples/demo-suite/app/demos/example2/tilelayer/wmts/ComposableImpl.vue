<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-98, 39], zoom: 4 });
// USGS 数据仅覆盖美国，中心点例外设北美中部
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/WMTS/tile/1.0.0/USGSTopo/default/GoogleMapsCompatible/{z}/{y}/{x}',
    attribution: '© USGS',
  },
});
</script>
