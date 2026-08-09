<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="() => sort321()">排序 3→2→1（bringToFront）</UButton>
      <UButton size="xs" color="primary" @click="() => sort123()">排序 1→2→3（setZIndex）</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.4854, 31.2285], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

const { layer } = useMaptalksVectorLayer(map)
let r3: { bringToFront?: () => unknown; bringToBack?: () => unknown; setZIndex?: (z: number) => unknown } | null = null
let r2: { bringToFront?: () => unknown; bringToBack?: () => unknown; setZIndex?: (z: number) => unknown } | null = null
let r1: { bringToFront?: () => unknown; bringToBack?: () => unknown; setZIndex?: (z: number) => unknown } | null = null

watch(
  () => toValue(layer),
  async (l) => {
    if (!l || r3) return
    const mt = await import('maptalks-gl')
    r3 = new mt.Polygon(
      [[121.4604, 31.225], [121.473, 31.225], [121.473, 31.234], [121.4604, 31.234]],
      { symbol: [{ lineColor: '#34495e', lineWidth: 3, polygonFill: '#1bbc9b', polygonOpacity: 1 }, { textName: '3', textWeight: 'bold', textSize: 30, textFill: '#fff' }] },
    )
    r2 = new mt.Polygon(
      [[121.4664, 31.231], [121.479, 31.231], [121.479, 31.240], [121.4664, 31.240]],
      { symbol: [{ lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(216,115,149)', polygonOpacity: 1 }, { textName: '2', textWeight: 'bold', textSize: 30, textFill: '#fff' }] },
    )
    r1 = new mt.Polygon(
      [[121.4724, 31.237], [121.485, 31.237], [121.485, 31.246], [121.4724, 31.246]],
      { symbol: [{ lineColor: '#34495e', lineWidth: 3, polygonFill: 'rgb(135,196,240)', polygonOpacity: 1 }, { textName: '1', textWeight: 'bold', textSize: 30, textFill: '#fff' }] },
    )
    // 原生 Polygon 数组赋建模 MaptalksGeometry 逆变不兼容——断言（6.5 同款）
    l.addGeometry?.([r3, r2, r1] as unknown as MaptalksGeometry[])
  },
)

function sort321() {
  r3?.bringToFront?.()
  r1?.bringToBack?.()
}

function sort123() {
  r1?.setZIndex?.(3)
  r2?.setZIndex?.(2)
  r3?.setZIndex?.(1)
}

onBeforeUnmount(() => { r3 = null; r2 = null; r1 = null })

const status = computed(() => (isReady.value ? '地图已创建（可调图形 z-index）' : '加载中…'))
</script>
