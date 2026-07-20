<template>
  <div>
    <div ref="elMain" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div ref="elOv" class="absolute bottom-3 right-3 rounded border-2 border-default overflow-hidden shadow-lg" style="width:180px;height:140px;z-index:10" />
    <p class="text-sm text-muted mt-2">鹰眼 Overview——第二张小地图同步全局视野（对应官网 10.13）。</p>
  </div>
</template>

<script setup lang="ts">
const elMain = ref<HTMLElement | null>(null)
const elOv = ref<HTMLElement | null>(null)
const { map: mapMain } = useMaptalks(elMain, { center: [121.5057, 31.2453], zoom: 13 })
const { map: mapOv } = useMaptalks(elOv, { center: [121.5057, 31.2453], zoom: 10, zoomControl: false, attribution: false })
useMaptalksTileLayer(mapMain, { source: 'osm' })
useMaptalksTileLayer(mapOv, { source: 'osm' })
watch(() => toValue(mapMain), (m) => {
  if (!m) return
  m.on('moving moveend zooming zoomend rotate pitch', () => {
    const ov = toValue(mapOv) as any; if (!ov) return
    ov.setCenter(m.getCenter())
    ov.setZoom(m.getZoom() - 3)
    ov.setPitch(m.getPitch())
    ov.setBearing(m.getBearing())
  })
})
</script>
