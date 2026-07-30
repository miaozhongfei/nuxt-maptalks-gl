<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UBadge variant="subtle" class="mt-2">已选中: {{ selected }}</UBadge>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
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
    // 重置所有标记
    geos.forEach((g) => g.setSymbol(normSymbol))
    // 使用 map.identify() 空间点选（官网核心 API）
    const m = toValue(map)
    const l = toValue(layer)
    if (!m || !l) return
    const hit = (m as any).identify({ coordinate: e.coordinate, layers: [l] }) as MGeo[]
    if (!hit || hit.length === 0) { selected.value = '无'; return }
    hit.forEach((g) => g.setSymbol(hlSymbol))
    selected.value = hit[0]?.getProperties()?.name ?? '?'
  },
})
</script>
