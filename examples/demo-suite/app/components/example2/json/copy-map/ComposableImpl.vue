<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyMap">复制地图 A - B</UButton>
    <p class="text-sm text-muted mt-2">A（底图 + Marker）toJSON 后复制到 B——B 为空图，复制后对齐 A（对应官网 11.5）。</p>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
// A：完整地图（底图 + VectorLayer('v') + Marker）
const { map: mapA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })
const { layer } = useMaptalksVectorLayer(mapA, { id: 'v' })
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 16, markerHeight: 16 } },
})
// B：空复制目标（无底图，复制时经 fromJSON 重建）
const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 10 })
const { toJSON: toA } = useMaptalksSerialize(mapA)
const { fromJSON: fromB } = useMaptalksSerialize(mapB)
function copyMap() {
  const json = toA()
  fromB(json)
}
</script>
