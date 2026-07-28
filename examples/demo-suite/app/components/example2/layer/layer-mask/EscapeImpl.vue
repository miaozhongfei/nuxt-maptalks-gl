<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

let m: any = null
let maskMarker: any = null

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv) return
    m = mv as any
    if (m._maskBound) return
    m._maskBound = true
    const mt = await import('maptalks-gl')
    const extent = m.getExtent()
    const min = extent.getMin()
    const w = extent.getWidth()
    const h = extent.getHeight()
    const markers = []
    for (let i = 0; i < 100; i++) {
      markers.push(new mt.Marker([min.x + Math.random() * w, min.y + Math.random() * h]))
    }
    const layer = new mt.VectorLayer('vector', markers)
    layer.addTo(m)
    m.on('mousemove', (e: any) => {
      if (!maskMarker) {
        maskMarker = new mt.Marker(e.coordinate, {
          symbol: { markerType: 'ellipse', markerWidth: 200, markerHeight: 200 },
        })
        layer.setMask(maskMarker)
      } else {
        maskMarker.setCoordinates(e.coordinate)
      }
    })
  },
)

onBeforeUnmount(() => { m = null; maskMarker = null })
</script>
