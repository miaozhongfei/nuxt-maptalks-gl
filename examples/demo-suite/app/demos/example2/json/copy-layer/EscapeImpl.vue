<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="copyLayer">复制图层</UButton>
    <p class="text-sm text-muted mt-2">Layer.toJSON / fromJSON 复制图层（对应官网 11.6）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
let srcLayer: any = null
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const layer = new mt.VectorLayer('src')
  new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 16, markerHeight: 16 } }).addTo(layer)
  new mt.Marker([121.5107, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 } }).addTo(layer)
  layer.addTo(m)
  srcLayer = layer
})
async function copyLayer() {
  const m = toValue(map); if (!m || !srcLayer) return
  const mt = await import('maptalks-gl')
  const json = srcLayer.toJSON()
  const newLayer = mt.Layer.fromJSON(json)
  newLayer.addTo(m)
}
</script>
