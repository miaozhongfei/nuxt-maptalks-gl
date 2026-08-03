<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="exportJson">导出为 JSON</UButton>
    </div>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-64">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksMarker + useMaptalksSerialize——map.toJSON() 序列化整图（含图层与图形，对应官网 11.3）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
// 官网 11.3：VectorLayer('v') + Marker，随整图序列化
const { layer } = useMaptalksVectorLayer(map, { id: 'v' })
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 } },
})
const { toJSON } = useMaptalksSerialize(map)

const result = ref('')
function exportJson() {
  const json = toJSON()
  result.value = JSON.stringify(json, null, 2)
}
</script>
