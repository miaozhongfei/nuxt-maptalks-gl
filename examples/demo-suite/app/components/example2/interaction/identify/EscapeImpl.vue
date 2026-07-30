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

// 逃生舱：工厂模式创建 VectorLayer + 5 个 Marker
const normSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 }
const hlSymbol = { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 20, markerHeight: 20 }

const positions: [number, number][] = [
  [121.49, 31.25], [121.50, 31.24], [121.5057, 31.2453], [121.51, 31.25], [121.52, 31.24],
]

type MGeo = { setSymbol: (s: Record<string, unknown>) => void; getProperties: () => Record<string, unknown> }

const { layer } = useMaptalksLayer(map, (mt) => {
  const vl = new mt.VectorLayer('v')
  positions.forEach((coords, i) => {
    vl.addGeometry(new mt.Marker(coords, { symbol: normSymbol, properties: { name: String.fromCodePoint(65 + i) } }))
  })
  return vl
})

const selected = ref('无')

useMaptalksEvents(map, {
  click: (e: { coordinate: { x: number; y: number } }) => {
    const l = toValue(layer) as unknown as { forEach: (cb: (g: MGeo) => void) => void } | null
    l?.forEach((g) => g.setSymbol(normSymbol))
    const m = toValue(map)
    const ly = toValue(layer)
    if (!m || !ly) return
    m.identify({ coordinate: e.coordinate, layers: [ly] }, (hit: unknown[]) => {
      const result = (hit ?? []) as MGeo[]
      if (result.length === 0) { selected.value = '无'; return }
      result.forEach((g) => g.setSymbol(hlSymbol))
      selected.value = result[0]?.getProperties()?.name ?? '?'
    })
  },
})
</script>
