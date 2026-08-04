<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyGeometry">复制几何 - B</UButton>
    <p class="text-sm text-muted mt-2">A 图 Rectangle 经 Geometry.fromJSON 复制到 B 图的空 v 图层——Marker 留在 A（对应官网 11.7）。</p>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
// A：底图 + v 图层（Marker + Rectangle 1000×800，对齐官网 11.7）
const { map: mapA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { layer: vA } = useMaptalksVectorLayer(mapA, { id: 'v' })
useMaptalksMarker(vA, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 } },
})
const { geometry: rectGeo } = useMaptalksRectangle(vA, {
  coordinates: [121.5057, 31.2453],
  width: 1000,
  height: 800,
  options: { symbol: { polygonFill: '#1bbc9b' } },
})
// B：底图 + 空 v 图层（复制目标）
const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { layer: vB } = useMaptalksVectorLayer(mapB, { id: 'v' })
// rect 几何序列化：toJSON + 静态 Geometry.fromJSON 重建独立副本
const { toJSON, fromJSON } = useMaptalksGeometrySerialize(rectGeo)
async function copyGeometry() {
  const lb = toValue(vB)
  if (!lb) return
  const copy = await fromJSON(toJSON())
  copy?.addTo(lb)
}
</script>
