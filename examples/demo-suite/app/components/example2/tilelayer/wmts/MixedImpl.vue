<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[-98, 39]"
    :zoom="4"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
// USGS 数据仅覆盖美国，中心点例外设北美中部
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/WMTS/tile/1.0.0/USGSTopo/default/GoogleMapsCompatible/{z}/{y}/{x}',
    attribution: '© USGS',
  },
});
</script>
