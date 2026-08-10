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
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

// 逃生舱：工厂模式创建 Marker
const { geometry } = useMaptalksGeometry(layer, (mt) =>
  new mt.Marker([121.5057, 31.2453], {
    symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerFillOpacity: 0.8, markerLineColor: '#fff', markerLineWidth: 3, markerWidth: 20, markerHeight: 20 },
  }),
)

let player: { play: () => void; cancel: () => void } | null = null

async function startAnim() {
  const mt = await import('maptalks-gl')
  const geo = toValue(geometry)
  if (!geo || typeof mt.animation?.Animation?.animate !== 'function') return
  player = mt.animation.Animation.animate(
    { symbol: { markerWidth: 80, markerHeight: 80 } },
    { duration: 1000, easing: 'out' },
    // 帧结构仅取 styles.symbol（原生动画引擎的逐帧插值结果）
    (frame: { styles?: { symbol?: Record<string, unknown> } }) => { if (frame.styles?.symbol) geo.updateSymbol(frame.styles.symbol) },
  )
  player.play()
}
function stopAnim() { player?.cancel(); player = null }

const status = computed(() => (isReady.value ? '地图已创建（自定义动画可启停）' : '加载中…'))
</script>
