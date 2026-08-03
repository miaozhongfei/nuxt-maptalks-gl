<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：GroupTileLayer 底图候选 + mt.control.LayerSwitcher，hover 切换（对应官网 10.19）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })

watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  // GroupTileLayer 底图：Carto light 可见 / Carto dark 隐藏（LayerSwitcher 自动列为候选）
  const gtl = new mt.GroupTileLayer('Base TileLayer', [
    new mt.TileLayer('Carto light', {
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    }),
    new mt.TileLayer('Carto dark', {
      visible: false,
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    }),
  ])
  m.setBaseLayer(gtl)
  // 叠加标记图层（LayerSwitcher 的 Layers 分组）
  const markers = [
    [121.5057, 31.2453], [121.5157, 31.2453], [121.5157, 31.2353],
  ]
  new mt.VectorLayer('Vector Markers', markers.map((c) => new mt.Marker(c, {
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 },
  }))).addTo(m as any)
  const circles = [
    [121.4957, 31.2453], [121.4957, 31.2353], [121.4957, 31.2553],
  ]
  new mt.VectorLayer('Circle Markers', circles.map((c) => new mt.Marker(c, {
    symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 },
  }))).addTo(m as any)
  // LayerSwitcher 控件
  new mt.control.LayerSwitcher({
    position: 'top-right',
    baseTitle: 'Base Layers',
    overlayTitle: 'Layers',
    excludeLayers: [],
    containerClass: 'maptalks-layer-switcher',
  }).addTo(m as any)
}, { immediate: true })
</script>
