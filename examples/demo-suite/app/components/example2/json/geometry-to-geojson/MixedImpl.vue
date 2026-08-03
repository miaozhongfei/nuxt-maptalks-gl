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
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="exportGeoJSON">导出为 GeoJSON</UButton>
    </div>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksMarker——properties 随几何，toGeoJSON() 导出（对应官网 11.2）。</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：从组件实例取 map，再经 composable 创建图层与几何
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { layer } = useMaptalksVectorLayer(map, { id: 'v' })
// 官网 11.2：Marker 带 properties（顶层 properties 字段），toGeoJSON() 导出
const mk = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  properties: { name: 'point marker' },
  options: { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 } },
})

const result = ref('')

function exportGeoJSON() {
  const geo = mk.geometry.value
  if (!geo) return
  result.value = JSON.stringify(geo.toGeoJSON(), null, 2)
}
</script>
