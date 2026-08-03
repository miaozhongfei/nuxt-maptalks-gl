<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksVectorLayer + useMaptalksGeoJSON——Feature（含 properties）转换为 Marker（对应官网 11.1）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 11.1 数据：Feature → GeoJSON.toGeometry → Marker（properties 随几何属性）
const geojson: GeoJSONData = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [121.5057, 31.2453] },
  properties: { name: 'point marker' },
}

const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
// useMaptalksGeoJSON 需要 VectorLayer（layer 就绪 + data 时 addGeometry）
const { layer } = useMaptalksVectorLayer(map, { id: 'v' })
useMaptalksGeoJSON(layer, { data: geojson })
</script>
