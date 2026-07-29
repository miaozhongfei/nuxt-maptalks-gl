<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

watch(
  () => mc.value?.map,
  async (mv) => {
    if (!mv) return
    const mt = await import('maptalks-gl')
    const m = mv as any
    const center = m.getCenter()

    const vl = new mt.VectorLayer('v').addTo(m)
    new mt.Marker(center, { symbol: { markerType: 'cross', markerWidth: 10, markerHeight: 10, markerLineWidth: 2 } }).addTo(vl)
    new mt.Circle(center, 1000, { symbol: { lineColor: '#fff', lineWidth: 6, lineOpacity: 0.2, polygonOpacity: 0 } }).addTo(vl)

    const pl = new mt.ParticleLayer('p', { forceRenderOnMoving: true })
    ;(pl as unknown as { getParticles: (t: number) => Array<{ point: unknown; r: number; color: string }> }).getParticles = (t: number) => {
      const point = m.coordinateToContainerPoint(center)
      const angle = (t / 16 % 360) * Math.PI / 180
      const pxLen = m.distanceToPixel(1000, 1000)
      const r = pxLen.width
      const x = r * Math.cos(angle)
      const y = r * Math.sin(angle)
      return [{ point: point.add(x, y), r: 4, color: 'rgb(135,196,240)' }]
    }
    pl.addTo(m)
  },
  { once: true },
)
</script>
