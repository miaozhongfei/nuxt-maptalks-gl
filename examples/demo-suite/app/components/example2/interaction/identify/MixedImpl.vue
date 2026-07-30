<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UBadge variant="subtle" class="mt-2">已选中: {{ selected }}</UBadge>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
const { layer } = useMaptalksVectorLayer(map)

const normSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 }
const hlSymbol = { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 20, markerHeight: 20 }

const positions: [number, number][] = [
  [121.49, 31.25], [121.50, 31.24], [121.5057, 31.2453], [121.51, 31.25], [121.52, 31.24],
]

type MGeo = { setSymbol: (s: Record<string, unknown>) => void; getProperties: () => Record<string, unknown> }
const geos: MGeo[] = []

positions.forEach((coords, i) => {
  const { geometry } = useMaptalksMarker(layer, {
    coordinates: coords,
    options: { symbol: normSymbol, properties: { name: String.fromCodePoint(65 + i) } },
  })
  watch(() => toValue(geometry), (g) => { if (g) geos.push(g as unknown as MGeo) })
})

const selected = ref('无')

useMaptalksEvents(map, {
  click: (e: { coordinate: { x: number; y: number } }) => {
    geos.forEach((g) => g.setSymbol(normSymbol))
    const m = toValue(map)
    const l = toValue(layer)
    if (!m || !l) return
    (m as any).identify({ coordinate: e.coordinate, layers: [l] }, (hit: MGeo[]) => {
      if (!hit || hit.length === 0) { selected.value = '无'; return }
      hit.forEach((g) => g.setSymbol(hlSymbol))
      selected.value = hit[0]?.getProperties()?.name ?? '?'
    })
  },
})
</script>
