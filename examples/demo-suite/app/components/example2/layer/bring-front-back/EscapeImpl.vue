<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" variant="soft" @click="blueRef?.bringToFront?.()">蓝层置顶</UButton>
      <UButton size="xs" color="error" variant="soft" @click="redRef?.bringToFront?.()">红层置顶</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

let blueRef: { bringToFront?: () => unknown } | null = null
let redRef: { bringToBack?: () => unknown } | null = null

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    const blueLayer = new mt.VectorLayer('blue')
    const redLayer = new mt.VectorLayer('red')
    const bluePoly = new mt.Polygon([[[121.495, 31.252], [121.51, 31.252], [121.51, 31.238], [121.495, 31.238]]], { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.6, lineColor: '#1d4ed8', lineWidth: 2 } })
    const redPoly = new mt.Polygon([[[121.5, 31.25], [121.515, 31.25], [121.515, 31.24], [121.5, 31.24]]], { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.6, lineColor: '#b91c1c', lineWidth: 2 } })
    bluePoly.addTo(blueLayer)
    redPoly.addTo(redLayer)
    blueLayer.addTo(m)
    redLayer.addTo(m)
    blueRef = blueLayer
    redRef = redLayer
  },
)

onBeforeUnmount(() => { blueRef = null; redRef = null })
</script>
