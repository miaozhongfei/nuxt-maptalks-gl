<template>
  <div>
    <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksVectorLayer id="v">
        <MaptalksGeoJSON :data="geojson" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksVectorLayer + MaptalksGeoJSON——Feature（含 properties）转换为 Marker（对应官网 11.1）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 11.1 数据：Feature → GeoJSON.toGeometry → Marker（properties 随几何属性）
const geojson: GeoJSONData = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [121.5057, 31.2453] },
  properties: { name: 'point marker' },
}
</script>
