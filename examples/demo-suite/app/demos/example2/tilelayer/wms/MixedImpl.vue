<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[-98, 39]"
    :zoom="4"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
// WMS 叠加 ahocevar GeoServer topp:states 图层
const wmsOptions = {
  urlTemplate: 'https://ahocevar.com/geoserver/wms',
  layers: 'topp:states',
  format: 'image/png',
  transparent: true,
};
useMaptalksWMSLayer(map, { options: wmsOptions });
</script>
