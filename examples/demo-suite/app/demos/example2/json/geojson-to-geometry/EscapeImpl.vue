<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱：GeoJSON.toGeometry 原生转换（对应官网 11.1）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const geojson = { type: 'Point', coordinates: [121.5057, 31.2453] }
  const geometry = mt.GeoJSON.toGeometry(geojson)
  const layer = new mt.VectorLayer('v').addTo(m)
  geometry.forEach((g: any) => g.addTo(layer))
})
</script>
