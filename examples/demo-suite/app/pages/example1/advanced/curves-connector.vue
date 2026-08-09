<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 曲线·连接线</h1>
    <p class="text-muted mb-6">演示曲线路径（ArcCurve）和连接线（ConnectorLine）逃生舱。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · ArcCurve 曲线</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 new ArcCurve()。</span><span class="text-xs text-muted ml-2">{{ status1 }}</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · CubicBezierCurve 贝塞尔</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 new CubicBezierCurve()。</span><span class="text-xs text-muted ml-2">{{ status2 }}</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304]

const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady: ready1 } = useMaptalks(el1, { center, zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
const { layer: vec1 } = useMaptalksVectorLayer(map1)
watch(
  () => toValue(vec1),
  async (layer) => {
    if (!layer) return
    try {
      const mt = await import('maptalks-gl')
      const arc = new mt.ArcCurve([[121.47, 31.23], [121.51, 31.25]], {
        symbol: { lineColor: '#2563eb', lineWidth: 3, arcDegree: 90 },
      })
      arc.addTo(layer as unknown as Parameters<typeof arc.addTo>[0])
    } catch {
      // 原生模块加载失败时静默（逃生舱失败不拖垮页面）
    }
  },
  { immediate: true },
)

const el2 = ref<HTMLElement | null>(null)
const { map: map2, isReady: ready2 } = useMaptalks(el2, { center, zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
const { layer: vec2 } = useMaptalksVectorLayer(map2)
watch(
  () => toValue(vec2),
  async (layer) => {
    if (!layer) return
    try {
      const mt = await import('maptalks-gl')
      const curve = new mt.CubicBezierCurve(
        [new mt.Coordinate(121.47, 31.23), new mt.Coordinate(121.49, 31.25), new mt.Coordinate(121.51, 31.24), new mt.Coordinate(121.48, 31.22)],
        { symbol: { lineColor: '#dc2626', lineWidth: 3 } },
      )
      curve.addTo(layer as unknown as Parameters<typeof curve.addTo>[0])
    } catch {
      // 原生模块加载失败时静默（逃生舱失败不拖垮页面）
    }
  },
  { immediate: true },
)

const status1 = computed(() => (ready1.value ? '地图已创建（ArcCurve 已加）' : '加载中…'))
const status2 = computed(() => (ready2.value ? '地图已创建（贝塞尔已加）' : '加载中…'))
</script>
