<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksLayerSwitcher——GroupTileLayer 底图候选 + 叠加图层，hover 切换（对应官网 10.19）。</p>
  </div>
</template>

<script setup lang="ts">
// LayerSwitcher 配置：右上角 + 底图/图层分组标题
const lsOpts: MaptalksLayerSwitcherOptions = {
  position: 'top-right',
  baseTitle: 'Base Layers',
  overlayTitle: 'Layers',
  excludeLayers: [],
  containerClass: 'maptalks-layer-switcher',
}

const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksLayerSwitcher(map, { options: lsOpts })

// GroupTileLayer 底图：Carto light 可见 / Carto dark 隐藏（LayerSwitcher 自动列为候选）
const { layer: gtl } = useMaptalksLayer(map, (mt) => new mt.GroupTileLayer('Base TileLayer', [
  new mt.TileLayer('Carto light', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd'],
  }),
  new mt.TileLayer('Carto dark', {
    visible: false,
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd'],
  }),
]))
// GroupTileLayer 显式设为底图——LayerSwitcher 的 Base Layers 分组依赖 getBaseLayer()
watch([() => toValue(map), gtl], ([m, g]) => { if (m && g) m.setBaseLayer(g) }, { immediate: true })

// 叠加标记图层（LayerSwitcher 的 Layers 分组）
const v1 = useMaptalksVectorLayer(map, { id: 'Vector Markers' })
useMaptalksMarker(v1.layer, { coordinates: [121.5057, 31.2453], options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } } })
useMaptalksMarker(v1.layer, { coordinates: [121.5157, 31.2453], options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } } })
useMaptalksMarker(v1.layer, { coordinates: [121.5157, 31.2353], options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } } })
const v2 = useMaptalksVectorLayer(map, { id: 'Circle Markers' })
useMaptalksMarker(v2.layer, { coordinates: [121.4957, 31.2453], options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } } })
useMaptalksMarker(v2.layer, { coordinates: [121.4957, 31.2353], options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } } })
useMaptalksMarker(v2.layer, { coordinates: [121.4957, 31.2553], options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } } })
</script>
