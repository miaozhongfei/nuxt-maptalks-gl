<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" variant="soft" @click="blueToFront">蓝层置顶</UButton>
      <UButton size="xs" color="error" variant="soft" @click="redToFront">红层置顶</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

let blueLayer: { bringToFront?: () => unknown } | null = null
let redLayer: { bringToFront?: () => unknown } | null = null

function blueToFront() { blueLayer?.bringToFront?.() }
function redToFront() { redLayer?.bringToFront?.() }

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    // 原生图层先存局部变量：geometry.addTo(layer) 需要原生 OverlayLayer 类型，直接对窄引用调用会丢成员
    const blue = new mt.VectorLayer('blue')
    const red = new mt.VectorLayer('red')
    const bluePoly = new mt.Polygon([[[121.495, 31.252], [121.51, 31.252], [121.51, 31.238], [121.495, 31.238]]], { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.8, lineColor: '#1d4ed8', lineWidth: 2 } })
    const redPoly = new mt.Polygon([[[121.5, 31.25], [121.515, 31.25], [121.515, 31.24], [121.5, 31.24]]], { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.8, lineColor: '#b91c1c', lineWidth: 2 } })
    bluePoly.addTo(blue)
    redPoly.addTo(red)
    blueLayer = blue
    redLayer = red
    // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    blue.addTo(m as never)
    red.addTo(m as never)
  },
)

onBeforeUnmount(() => { blueLayer = null; redLayer = null })

const status = computed(() => (isReady.value ? '地图已创建（可置顶图层）' : '加载中…'))
</script>
