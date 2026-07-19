<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="copyGeometry">复制几何</UButton>
    <p class="text-sm text-muted mt-2">Geometry.toJSON / fromJSON 复制几何（对应官网 11.7）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
let srcMarker: any = null
let layer: any = null
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  layer = new mt.VectorLayer('v').addTo(m)
  srcMarker = new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 } })
  srcMarker.addTo(layer)
})
async function copyGeometry() {
  const m = toValue(map); if (!m || !srcMarker) return
  const mt = await import('maptalks-gl')
  const json = srcMarker.toJSON()
  const cloned = mt.Geometry.fromJSON(json)
  cloned.setCoordinates([121.5157, 31.2453])
  cloned.updateSymbol({ markerFill: '#10b981' })
  cloned.addTo(layer)
}
</script>
