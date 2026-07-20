<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">点击 Marker 弹出 InfoWindow（对应官网 10.5）。</p>
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
  const marker = new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#10b981', markerWidth: 18, markerHeight: 18 } })
  marker.setInfoWindow({ title: 'Marker 信息', content: '<div style=padding:4px>点击弹出的信息框</div>' })
  marker.addTo(layer)
})
</script>
