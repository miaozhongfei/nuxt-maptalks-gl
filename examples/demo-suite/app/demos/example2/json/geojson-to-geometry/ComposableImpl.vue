<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">Composable：useMaptalksGeoJSON 转换 GeoJSON 为图形（对应官网 11.1）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const geojson = { type: 'Point', coordinates: [121.5057, 31.2453] }
useMaptalksGeoJSON(map, geojson)
</script>
