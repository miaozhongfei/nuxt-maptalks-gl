<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="6"
      :options="{ spatialReference: { projection: 'EPSG:4326' } }"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksWMSLayer :options="wmsOptions" />
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const wmsOptions = {
  urlTemplate: 'https://ows.terrestris.de/osm/service',
  tileSystem: [1, -1, -180, 90],
  crs: 'EPSG:4326',
  layers: 'OSM-WMS',
  version: '1.3.0',
  format: 'image/png',
  transparent: true,
  uppercase: true,
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（WMS 底图）' : '加载中…'))
</script>
