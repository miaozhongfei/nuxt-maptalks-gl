<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
  </div>
</template>

<script setup lang="ts">
const randomPts = Array.from({ length: 100 }, () => [
  121.4757 + Math.random() * 0.06,
  31.2153 + Math.random() * 0.06,
] as [number, number])

const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

const { layer: vectorLayer } = useMaptalksVectorLayer(map, { id: 'vector' })
randomPts.forEach((c, i) => {
  useMaptalksMarker(vectorLayer, {
    coordinates: c,
    options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 } },
    id: `mk${i}`,
  })
})

let maskMarker: any = null
let maskBound = false

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv) return
    const m = mv as any
    if (maskBound) return
    maskBound = true
    const mt = await import('maptalks-gl')
    m.on('mousemove', (e: any) => {
      if (maskMarker) {
        maskMarker.setCoordinates(e.coordinate)
      } else {
        maskMarker = new mt.Marker(e.coordinate, {
          symbol: { markerType: 'ellipse', markerWidth: 200, markerHeight: 200 },
        })
        ;(toValue(vectorLayer) as any)?.setMask?.(maskMarker)
      }
    })
  },
)

onBeforeUnmount(() => { maskMarker = null })
</script>
