<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyLayer">复制图层 v0 - B</UButton>
    <p class="text-sm text-muted mt-2">A 图 v0（Marker）经 Layer.fromJSON 复制到 B 图——v1（Rectangle）留在 A（对应官网 11.6）。</p>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
// A：底图 + v0(Marker) + v1(Rectangle) 两层（对齐官网 11.6）
const { map: mapA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { layer: v0 } = useMaptalksVectorLayer(mapA, { id: 'v0' })
useMaptalksMarker(v0, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 } },
})
const { layer: v1 } = useMaptalksVectorLayer(mapA, { id: 'v1' })
useMaptalksRectangle(v1, {
  coordinates: [121.5057, 31.2453],
  width: 1000,
  height: 800,
  options: { symbol: { polygonFill: '#1bbc9b' } },
})
// v0 图层序列化：toJSON + 静态 Layer.fromJSON 重建独立副本
const { toJSON, fromJSON } = useMaptalksLayerSerialize(v0)
async function copyLayer() {
  const mb = toValue(mapB)
  if (!mb) return
  const copy = await fromJSON(toJSON())
  if (!copy) return
  // 幂等：重复复制时先移除 B 上同 id 副本（maptalks 同 id addLayer 会抛 Duplicate）
  mb.getLayer('v0')?.remove()
  copy.addTo(mb)
}
</script>
