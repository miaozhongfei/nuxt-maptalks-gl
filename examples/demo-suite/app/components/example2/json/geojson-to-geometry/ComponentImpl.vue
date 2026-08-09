<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksVectorLayer id="v">
        <MaptalksGeoJSON :data="geojson" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksVectorLayer + MaptalksGeoJSON——Feature（含 properties）转换为 Marker（对应官网 11.1）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

// 官网 11.1 数据：Feature → GeoJSON.toGeometry → Marker（properties 随几何属性）
const geojson: GeoJSONData = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [121.5057, 31.2453] },
  properties: { name: 'point marker' },
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（Marker 已转换）' : '加载中…'))
</script>
