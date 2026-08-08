<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :base-layer="blOpts"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer id="Vector Markers">
        <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="{ symbol: MKR_SYM_1 }" />
        <MaptalksMarker :coordinates="[121.5157, 31.2453]" :options="{ symbol: MKR_SYM_1 }" />
        <MaptalksMarker :coordinates="[121.5157, 31.2353]" :options="{ symbol: MKR_SYM_1 }" />
      </MaptalksVectorLayer>
      <MaptalksVectorLayer id="Circle Markers">
        <MaptalksMarker :coordinates="[121.4957, 31.2453]" :options="{ symbol: MKR_SYM_2 }" />
        <MaptalksMarker :coordinates="[121.4957, 31.2353]" :options="{ symbol: MKR_SYM_2 }" />
        <MaptalksMarker :coordinates="[121.4957, 31.2553]" :options="{ symbol: MKR_SYM_2 }" />
      </MaptalksVectorLayer>
      <MaptalksLayerSwitcherControl :options="lsOpts" />
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksVectorLayer/MaptalksMarker 声明式图层 + MaptalksLayerSwitcherControl——baseLayer 数组多底图候选，hover 切换（对应官网 10.19）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

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

// 叠加标记图层样式（LayerSwitcher 的 Layers 分组）
const MKR_SYM_1 = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 }
const MKR_SYM_2 = { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 }

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（LayerSwitcher 可用）' : '加载中…'))
</script>
