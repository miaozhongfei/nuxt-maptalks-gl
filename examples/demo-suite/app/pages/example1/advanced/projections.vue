<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 投影</h1>
    <p class="text-muted mb-6">演示 <code>useMaptalksCoordinate</code> 坐标转换与 maptalks projection 逃生舱。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">坐标转换 · containerPoint ↔ coordinate</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">移动鼠标查看实时转换。屏幕坐标：{{ screenPt }}，经纬度：{{ geoCoord }}</span><span class="text-xs text-muted ml-2">{{ status1 }}</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · native projection API</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 <code>map.getProjection()</code> / <code>coordinateToContainerPoint</code> 等。</span><span class="text-xs text-muted ml-2">{{ status2 }}</span></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">逃生舱 · 自定义 projection 示例</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:350px" />
      <template #footer><span class="text-sm text-muted">OSM 瓦片为 EPSG:3857，自定义 EPSG:4326 projection 需配对应瓦片源。</span><span class="text-xs text-muted ml-2">{{ status3 }}</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304]

const el1 = ref<HTMLElement | null>(null)
const { map: map1, isReady: ready1 } = useMaptalks(el1, { center, zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })

const screenPt = ref('')
const geoCoord = ref('')

useMaptalksEvents(map1, {
  mousemove: (e: unknown) => {
    const ev = e as { coordinate: { x: number; y: number }; containerPoint: { x: number; y: number } }
    screenPt.value = `(${ev.containerPoint.x.toFixed(0)}, ${ev.containerPoint.y.toFixed(0)})`
    geoCoord.value = `[${ev.coordinate.x.toFixed(5)}, ${ev.coordinate.y.toFixed(5)}]`
  },
})

const el2 = ref<HTMLElement | null>(null)
const { map: map2, isReady: ready2 } = useMaptalks(el2, { center, zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
const { layer: projVec } = useMaptalksVectorLayer(map2)
useMaptalksLabel(projVec, {
  content: () => {
    const m = toValue(map2)
    if (!m) return '加载中…'
    // getProjection 返回结构未完全建模，断言 code 字段展示投影名
    const proj = m.getProjection() as { code?: string }
    return proj.code ? `投影: ${proj.code.toUpperCase()}` : '投影: —'
  },
  coordinates: [121.4737, 31.2304],
  options: { symbol: { textFaceName: 'monospace', textSize: 14, textFill: '#2563eb', textHaloFill: '#fff', textHaloRadius: 2 } },
})

// 卡片 3：自定义 projection 示例（默认 EPSG:3857，EPSG:4326 需要对应的瓦片源）
const el3 = ref<HTMLElement | null>(null)
const { map: map3, isReady: ready3 } = useMaptalks(el3, { center, zoom: 13 })
useMaptalksTileLayer(map3, { source: 'osm' })
const { layer: projVec3 } = useMaptalksVectorLayer(map3)
useMaptalksLabel(projVec3, {
  content: 'EPSG:3857（默认）',
  coordinates: [121.47, 31.23],
  options: { symbol: { textFaceName: 'monospace', textSize: 14, textFill: '#dc2626', textHaloFill: '#fff', textHaloRadius: 2 } },
})

const status1 = computed(() => (ready1.value ? '地图已创建' : '加载中…'))
const status2 = computed(() => (ready2.value ? '地图已创建' : '加载中…'))
const status3 = computed(() => (ready3.value ? '地图已创建' : '加载中…'))
</script>
