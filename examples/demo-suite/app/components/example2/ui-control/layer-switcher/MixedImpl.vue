<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :base-layer="blOpts"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksLayerSwitcher——baseLayer 数组声明多底图候选（GroupTileLayer）+ 叠加图层，hover 切换（对应官网 10.19）。</p>
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

// baseLayer 数组：Carto light 可见 / Carto dark 隐藏（自动打包 GroupTileLayer，LayerSwitcher 列为 Base Layers 候选）
const blOpts: Array<string | { id?: string | number; source?: string; options?: Record<string, unknown> }> = [
  { id: 'Carto light', options: { urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'] } },
  { id: 'Carto dark', options: { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'], visible: false } },
]

// MaptalksMap ref 桥接：从组件实例取 map，再经 composable 创建控件与叠加图层
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

useMaptalksLayerSwitcher(map, { options: lsOpts })

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
