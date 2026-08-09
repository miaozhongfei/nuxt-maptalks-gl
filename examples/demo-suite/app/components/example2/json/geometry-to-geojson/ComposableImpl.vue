<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="exportGeoJSON">导出为 GeoJSON</UButton>
    </div>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksMarker——properties 随几何，toGeoJSON() 导出（对应官网 11.2）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { layer } = useMaptalksVectorLayer(map, { id: 'v' })
// 官网 11.2：Marker 带 properties（构造 options 内），toGeoJSON() 导出
const mk = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: {
    properties: { name: 'point marker' },
    symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 },
  },
})

const result = ref('')

function exportGeoJSON() {
  const geo = mk.geometry.value
  if (!geo) return
  result.value = JSON.stringify(geo.toGeoJSON(), null, 2)
}

const status = computed(() => (isReady.value ? '地图已创建（可导出 GeoJSON）' : '加载中…'))
</script>
