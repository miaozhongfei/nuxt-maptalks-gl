<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 动画特效</h1>
    <p class="text-muted mb-6">演示几何动画（平移、缩放、样式过渡）。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">Marker 平移动画</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="moveMarker()">移动 Marker</UButton><span class="text-sm text-muted">原生 geometry.animate()</span><span class="text-xs text-muted">{{ status1 }}</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">样式闪烁效果</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="flashMarker()">闪烁</UButton><span class="text-sm text-muted">原生 geometry.setSymbol()</span><span class="text-xs text-muted">{{ status2 }}</span></div></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">geometry.copy() / clone —— 复制图形</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:350px" />
      <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="copyMarker()">复制 Marker</UButton><span class="text-sm text-muted">原生 geometry.copy() 复制到新位置。</span><span class="text-xs text-muted">{{ status3 }}</span></div></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304]

const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady: ready1 } = useMaptalks(el1, { center, zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
const { layer: vec1 } = useMaptalksVectorLayer(map1)
const { geometry: g1 } = useMaptalksMarker(vec1, {
  coordinates: [121.47, 31.23],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 } },
})
function moveMarker() {
  const geo = toValue(g1) as { animate?: (opts: Record<string, unknown>, animOpts?: Record<string, unknown>, cb?: () => void) => void } | null
  geo?.animate?.({ coordinates: [121.50, 31.24] }, { duration: 1500 })
  setTimeout(() => geo?.animate?.({ coordinates: [121.47, 31.23] }, { duration: 1500 }), 2000)
}

const el2 = ref<HTMLElement | null>(null)
const { map: map2, isReady: ready2 } = useMaptalks(el2, { center, zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
const { layer: vec2 } = useMaptalksVectorLayer(map2)
const { geometry: g2 } = useMaptalksMarker(vec2, {
  coordinates: [121.5, 31.24],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 } },
})
const colors = ['#dc2626', '#f59e0b', '#dc2626', '#2563eb', '#dc2626', '#16a34a']
let flashTimer: ReturnType<typeof setTimeout> | null = null
function flashMarker() {
  // 防止重复点击
  if (flashTimer) return
  const geo = toValue(g2) as { setSymbol?: (s: Record<string, unknown>) => void } | null
  if (!geo) return
  let i = 0
  flashTimer = setInterval(() => {
    geo.setSymbol?.({ markerType: 'ellipse', markerFill: colors[i % colors.length], markerWidth: 24, markerHeight: 24 })
    if (++i >= colors.length) {
      clearInterval(flashTimer!)
      flashTimer = null
    }
  }, 300)
}
onBeforeUnmount(() => { if (flashTimer) clearInterval(flashTimer) })

// 卡片 3：geometry.copy() 复制图形
const el3 = ref<HTMLElement | null>(null)
const { map: map3, isReady: ready3 } = useMaptalks(el3, { center, zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
const { layer: vec3 } = useMaptalksVectorLayer(map3)
const { geometry: g3 } = useMaptalksMarker(vec3, {
  coordinates: [121.47, 31.23],
  options: { symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 24, markerHeight: 24 } },
})
let copyCount = 0
function copyMarker() {
  const geo = toValue(g3) as { copy?: () => { setSymbol?: (s: Record<string, unknown>) => void; setCoordinates?: (c: [number, number]) => void; addTo?: (l: unknown) => void } } | null
  const layer = toValue(vec3)
  if (!geo?.copy || !layer) return
  copyCount++
  const clone = geo.copy()
  // 偏移坐标使副本可见
  clone.setCoordinates?.([121.47 + copyCount * 0.01, 31.23 + copyCount * 0.005])
  clone.setSymbol?.({ markerType: 'ellipse', markerFill: copyCount % 2 === 0 ? '#f59e0b' : '#8b5cf6', markerWidth: 24, markerHeight: 24 })
  clone.addTo?.(layer)
}

const status1 = computed(() => (ready1.value ? '地图已创建' : '加载中…'))
const status2 = computed(() => (ready2.value ? '地图已创建' : '加载中…'))
const status3 = computed(() => (ready3.value ? '地图已创建' : '加载中…'))
</script>
