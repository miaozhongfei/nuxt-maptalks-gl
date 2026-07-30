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
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
const { layer } = useMaptalksVectorLayer(map)

const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 }
const hoverSymbol = { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 24, markerHeight: 24 }

useMaptalksMarker(layer, { coordinates: [121.495, 31.248], options: { symbol: normalSymbol } })
useMaptalksMarker(layer, { coordinates: [121.5057, 31.2453], options: { symbol: normalSymbol } })
useMaptalksMarker(layer, { coordinates: [121.515, 31.242], options: { symbol: normalSymbol } })

type Geo = { setSymbol: (s: Record<string, unknown>) => void }

useMaptalksEvents(map, {
  mouseenter: (e: unknown) => { (e as { target?: Geo }).target?.setSymbol?.(hoverSymbol) },
  mouseout: (e: unknown) => { (e as { target?: Geo }).target?.setSymbol?.(normalSymbol) },
})
</script>
