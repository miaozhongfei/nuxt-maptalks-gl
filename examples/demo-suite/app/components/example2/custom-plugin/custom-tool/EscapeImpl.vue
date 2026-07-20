<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" :variant="toolActive ? 'solid' : 'outline'" @click="toggleTool">{{ toolActive ? '关闭' : '开启' }}绘制工具</UButton>
    <p class="text-sm text-muted mt-2">自定义地图工具——点击地图绘制 Marker（对应官网 13.3）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const toolActive = ref(false)
let layer: any = null
let clickHandler: any = null
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  layer = new mt.VectorLayer('draw').addTo(m)
})
function toggleTool() {
  toolActive.value = !toolActive.value
  const m = toValue(map); if (!m) return
  if (toolActive.value) {
    clickHandler = (e: any) => {
      import('maptalks-gl').then(mt => {
        const marker = new mt.Marker(e.coordinate, { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 12, markerHeight: 12 } })
        marker.addTo(layer)
      })
    }
    m.on('click', clickHandler)
  } else if (clickHandler) {
    m.off('click', clickHandler); clickHandler = null
  }
}
onUnmounted(() => {
  const m = toValue(map)
  if (m && clickHandler) m.off('click', clickHandler)
})
</script>
