<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" variant="outline" @click="startAnim">开始</UButton>
      <UButton size="sm" variant="outline" @click="stopAnim">停止</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerFillOpacity: 0.8, markerLineColor: '#fff', markerLineWidth: 3, markerWidth: 20, markerHeight: 20 } },
})

let player: { play: () => void; cancel: () => void } | null = null

async function startAnim() {
  const mt = await import('maptalks-gl')
  const geo = toValue(geometry)
  if (!geo || typeof mt.animation?.Animation?.animate !== 'function') return
  player = mt.animation.Animation.animate(
    { symbol: { markerWidth: 80, markerHeight: 80 } },
    { duration: 1000, easing: 'out' },
    (frame: any) => { if (frame.styles) geo.updateSymbol(frame.styles.symbol) },
  )
  player.play()
}
function stopAnim() { player?.cancel(); player = null }
</script>
