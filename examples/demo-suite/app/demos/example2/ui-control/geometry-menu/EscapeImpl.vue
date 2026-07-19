<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">右键点击 Marker 弹出提示（对应官网 10.2）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const layer = new mt.VectorLayer('v').addTo(m)
  const marker = new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 18, markerHeight: 18 } })
  marker.on('contextmenu', (e: any) => { alert('Marker ' + JSON.stringify(e.coordinate.toFixed(4))) })
  marker.addTo(layer)
})
</script>
