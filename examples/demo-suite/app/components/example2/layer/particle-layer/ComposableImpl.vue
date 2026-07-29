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
watch(() => toValue(map), (mv) => { if (!m && mv) m = mv })

const { layer: vl } = useMaptalksVectorLayer(map)
useMaptalksMarker(vl, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'cross', markerWidth: 10, markerHeight: 10, markerLineWidth: 2 } },
})
useMaptalksCircle(vl, {
  coordinates: [121.5057, 31.2453],
  radius: 1000,
  options: { symbol: { lineColor: '#fff', lineWidth: 6, lineOpacity: 0.2, polygonOpacity: 0 } },
})

useMaptalksLayer(map, (mt) => {
  const pl = new mt.ParticleLayer('p', { forceRenderOnMoving: true })
  ;(pl as unknown as { getParticles: (t: number) => Array<{ point: unknown; r: number; color: string }> }).getParticles = (t: number) => {
    if (!m) return []
    const center = m.getCenter()
    const point = m.coordinateToContainerPoint(center)
    const angle = (t / 16 % 360) * Math.PI / 180
    const pxLen = m.distanceToPixel(1000, 1000)
    const r = pxLen.width
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)
    return [{ point: point.add(x, y), r: 4, color: 'rgb(135,196,240)' }]
  }
  return pl
})
</script>
