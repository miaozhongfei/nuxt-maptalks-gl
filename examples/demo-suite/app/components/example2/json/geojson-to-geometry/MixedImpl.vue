<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksVectorLayer + useMaptalksGeoJSON——Feature（含 properties）转换为 Marker（对应官网 11.1）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 11.1 数据：Feature → GeoJSON.toGeometry → Marker（properties 随几何属性）
const geojson: GeoJSONData = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [121.5057, 31.2453] },
  properties: { name: 'point marker' },
}

// MaptalksMap ref 桥接：从组件实例取 map，再经 composable 创建图层与转换
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { layer } = useMaptalksVectorLayer(map, { id: 'v' })
useMaptalksGeoJSON(layer, { data: geojson })
</script>
