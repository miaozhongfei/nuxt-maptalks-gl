<template>
  <div>
    <h1>Multi 几何与 GeoJSON</h1>
    <div style="margin-bottom: 12px">
      <button data-testid="toggle" @click="toggleData">切换 GeoJSON 数据</button>
    </div>
    <MaptalksMap :center="[121.4737, 31.2304]" :zoom="11" data-testid="map" class="map">
      <MaptalksTileLayer source="osm" />
      <MaptalksVectorLayer>
        <MaptalksMultiPoint
          :coordinates="[[121.46, 31.22], [121.49, 31.24]]"
          :symbol="{ markerType: 'ellipse', markerWidth: 16, markerHeight: 16, markerFill: '#de3333' }"
        />
        <MaptalksGeoJSON :data="geojson" :symbol="{ lineColor: '#1bbc9b', lineWidth: 2 }" />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const featureA = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[121.45, 31.21], [121.50, 31.25]] } },
  ],
};
const featureB = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [[121.45, 31.25], [121.50, 31.21]] } },
  ],
};
const geojson = ref<Record<string, unknown>>(featureA);

/** 替换 GeoJSON data（清空重建） */
function toggleData(): void {
  geojson.value = geojson.value === featureA ? featureB : featureA;
}
</script>

<style scoped>
.map {
  height: 440px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
