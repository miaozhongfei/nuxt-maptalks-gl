<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

watch(
  () => toValue(map),
  async (mv) => {
    if (!mv) return
    const mt = await import('maptalks-gl')
    const layer = new mt.VectorLayer('v', { globalCompositeOperation: 'difference' }).addTo(mv as any)
    const colors = ['#f00', '#0f0', '#00f']
    const markers = []
    for (let i = 0; i < 50; i++) {
      const x = 121.5057 + (Math.random() - 0.5) * 0.055 * 0.5
      const y = 31.2453 + (Math.random() - 0.5) * 0.03 * 0.5
      const color = colors[Math.floor(Math.random() * 3)]
      markers.push(new mt.Marker([x, y], {
        symbol: { markerType: 'ellipse', markerFill: color, markerFillOpacity: 1, markerLineWidth: 1, markerLineColor: color, markerWidth: 70, markerHeight: 70 },
      }))
    }
    layer.addGeometry(markers)
  },
)
</script>
