<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.GeoJSON.toGeometry(feature) → Marker addTo（对应官网 11.1）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  // 官网 11.1：Feature → GeoJSON.toGeometry → Marker → addTo(VectorLayer)
  const json = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [121.5057, 31.2453] },
    properties: { name: 'point marker' },
  }
  const layer = new mt.VectorLayer('v').addTo(m as any)
  mt.GeoJSON.toGeometry(json).addTo(layer)
}, { immediate: true })
</script>
