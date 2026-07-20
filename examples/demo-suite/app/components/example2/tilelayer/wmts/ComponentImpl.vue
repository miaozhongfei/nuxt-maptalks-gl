<template>
  <MaptalksMap
    :center="[-98, 39]"
    :zoom="4"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksTileLayer :options="tileOptions" />
  </MaptalksMap>
</template>

<script setup lang="ts">
const tileOptions = {
  // USGS 数据仅覆盖美国，中心点例外设北美中部
  urlTemplate: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/WMTS/tile/1.0.0/USGSTopo/default/GoogleMapsCompatible/{z}/{y}/{x}',
  attribution: '© USGS',
};
</script>
