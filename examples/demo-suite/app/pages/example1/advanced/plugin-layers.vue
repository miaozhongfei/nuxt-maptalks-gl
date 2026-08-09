<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 插件图层</h1>
    <p class="text-muted mb-6">演示 GroupGLLayer 分组和 4 种第三方插件图层逃生舱。</p>

    <UCard class="mb-4">
      <template #header><h2 class="font-semibold">GroupGLLayer · GL 图层分组</h2></template>
      <MaptalksMap ref="mc" :center="center" :zoom="15" :pitch="50" class="relative rounded border border-default overflow-hidden" style="height:320px" />
      <template #footer><span class="text-sm text-muted">useMaptalksGroupGLLayer + VectorLayer + Polygon。</span><span class="text-xs text-muted ml-2">{{ status1 }}</span></template>
    </UCard>

    <div class="grid grid-cols-2 gap-4">
      <UCard v-for="(p, index) in plugins" :key="p.name">
        <template #header><div class="flex items-center gap-2"><h2 class="font-semibold">{{ p.name }}</h2><UBadge :color="p.status==='ok'?'success':p.status==='loading'?'neutral':'error'" variant="subtle">{{ p.status === 'ok' ? '已加载' : p.status === 'loading' ? '加载中' : '不可用' }}</UBadge></div></template>
        <div :ref="(el: unknown) => pluginEls[index].value = el as HTMLElement | null" class="relative rounded border border-default overflow-hidden" style="height:320px" />
        <template #footer><span class="text-sm text-muted">{{ p.note }}</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304]

// THREE 无类型声明（three@0.169 不携带 d.ts），动态导入 + as string 规避 ts-plugin 7016
let THREE: any = null

// 卡片 1：GroupGLLayer
const mc = ref<MaptalksMapExposed | null>(null)
const map1 = computed(() => toValue(mc.value?.map) ?? null)
useMaptalksTileLayer(map1, { source: 'osm' })
useMaptalksGroupGLLayer(map1, {})
const { layer: vec1 } = useMaptalksVectorLayer(map1)
useMaptalksPolygon(vec1, {
  coordinates: [[121.472, 31.231], [121.476, 31.231], [121.476, 31.234], [121.472, 31.234]],
  options: { symbol: { polygonFill: '#8b5cf6', polygonOpacity: 0.7, lineWidth: 2, lineColor: '#6d28d9' } },
})

// 插件卡片数据
const plugins = ref([
  { name: 'maptalks.heatmap', status: 'loading' as string, note: '热力图图层。' },
  { name: 'maptalks.markercluster', status: 'loading' as string, note: '点聚合图层。' },
  { name: 'maptalks.three', status: 'loading' as string, note: 'Three.js 3D 图层。' },
  { name: 'maptalks.e3', status: 'loading' as string, note: 'ECharts 3D 图层。' },
])

// 每张插件卡片预先创建 el ref → useMaptalks → template :ref 回调绑定
const pluginEls = plugins.value.map(() => ref<HTMLElement | null>(null))
const pluginMaps = pluginEls.map(el => {
  const { map } = useMaptalks(el, { center, zoom: 13, pitch: 60 })
  useMaptalksTileLayer(map, { source: 'osm' })
  return { map, el }
})

function setupHeatmap(m: unknown, pts: [number, number][], HeatLayer: unknown) {
  const layer = new (HeatLayer as new (id: string, data?: unknown) => { addTo: (m: unknown) => void } & Record<string, unknown>)('heat', pts.map(p => [p[0], p[1], Math.random()]))
  layer.addTo(m)
}

async function setupCluster(m: unknown, pts: [number, number][], ClusterLayer: unknown) {
  const mt = await import('maptalks-gl')
  const layer = new (ClusterLayer as new (id: string, opts?: Record<string, unknown>) => { addTo: (m: unknown) => void; addGeometry: (g: unknown[]) => void } & Record<string, unknown>)('cluster')
  layer.addTo(m)
  layer.addGeometry(pts.map(p => new mt.Marker(p)))
}

function setupThree(m: unknown, pts: [number, number][], ThreeLayer: unknown) {
  const layer = new (ThreeLayer as new (id: string, opts?: Record<string, unknown>) => { addTo: (m: unknown) => void; prepareToDraw?: (gl: unknown, scene: unknown, camera: unknown) => void; toBox: (coord: [number, number], opts: Record<string, unknown>, mat: THREE.Material) => unknown; addMesh: (ms: unknown[]) => void; redraw?: () => void } & Record<string, unknown>)('three', { forceRenderOnMoving: true, forceRenderOnRotating: true })
  layer.prepareToDraw = function (_gl: unknown, scene: unknown, _camera: unknown) {
    const s = scene as { add: (o: unknown) => void }
    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(0, -10, 10).normalize()
    s.add(light)
    s.add(new THREE.AmbientLight(0xffffff, 0.6))
  }
  layer.addTo(m)
  // addMesh 必须在场景就绪后调用；否则 getScene() 返回 null 会抛 TypeError
  ;(layer as Record<string, unknown>).onCanvasCreate = function () {
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const boxes = pts.slice(0, 10).map(pt => (layer as unknown as { toBox: (c: [number, number], o: Record<string, unknown>, m: THREE.Material) => THREE.Object3D }).toBox(pt as [number, number], { height: 200, radius: 100, topColor: '#ff4444' }, mat))
    layer.addMesh(boxes)
  }
}

function setupE3(m: unknown, pts: [number, number][], E3Layer: unknown) {
  const layer = new (E3Layer as new (id: string, opts?: Record<string, unknown>) => { addTo: (m: unknown) => void } & Record<string, unknown>)('e3', { series: [{ type: 'scatter', coordinateSystem: 'maptalks', data: pts.map(p => [p[0], p[1], Math.random() * 100]) }] })
  layer.addTo(m)
}

onMounted(async () => {
  THREE = await import('three' as string)
  await Promise.all(pluginMaps.map(({ map: mapRef }) => {
    if (toValue(mapRef)) return Promise.resolve()
    return new Promise<void>((resolve) => {
      const stop = watch(() => toValue(mapRef), (m) => { if (m) { stop(); resolve() } })
    })
  }))

  const pts = Array.from({ length: 50 }, () => [121.47 + (Math.random() - 0.5) * 0.03, 31.23 + (Math.random() - 0.5) * 0.03] as [number, number])

  const setups = [
    { idx: 0, pkg: 'maptalks.heatmap', importFn: () => import('maptalks.heatmap' as string), exportName: 'HeatLayer', fn: setupHeatmap },
    { idx: 1, pkg: 'maptalks.markercluster', importFn: () => import('maptalks.markercluster' as string), exportName: 'ClusterLayer', fn: setupCluster },
    { idx: 2, pkg: 'maptalks.three', importFn: () => import('maptalks.three' as string), exportName: 'ThreeLayer', fn: setupThree },
    { idx: 3, pkg: 'maptalks.e3', importFn: () => import('maptalks.e3' as string), exportName: 'E3Layer', fn: setupE3 },
  ]

  for (const s of setups) {
    try {
      const mod = await s.importFn()
      const Ctor = (mod as Record<string, unknown>)[s.exportName]
      const m = toValue(pluginMaps[s.idx].map)
      if (m && typeof Ctor === 'function') {
        s.fn(m, pts, Ctor)
        plugins.value[s.idx].status = 'ok'
      }
    }
    catch {
      plugins.value[s.idx].status = 'error'
      plugins.value[s.idx].note = `${s.pkg} 不可用。`
    }
  }
})

const status1 = computed(() => (map1.value ? '地图已创建（GroupGLLayer）' : '加载中…'))
</script>
