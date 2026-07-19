<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="exportGeoJSON">导出为 GeoJSON</UButton>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-48">{{ result }}</pre>
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
const result = ref('')
let markerGeo: any = null
watch(() => map.value, async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const layer = new mt.VectorLayer('v').addTo(m)
  markerGeo = new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 } })
  markerGeo.addTo(layer)
})
function exportGeoJSON() {
  if (!markerGeo) return
  result.value = JSON.stringify(markerGeo.toGeoJSON(), null, 2)
}
</script>
