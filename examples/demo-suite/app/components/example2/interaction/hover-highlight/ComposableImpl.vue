<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 }
const hoverSymbol = { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 24, markerHeight: 24 }

// setSymbol 建模签名与窄类型逆变不兼容——窄断言收拢事件 target
type Geo = { setSymbol: (s: Record<string, unknown>) => void }
const hoverEvents = {
  mouseenter: (e: unknown) => { (e as { target?: Geo }).target?.setSymbol?.(hoverSymbol) },
  mouseout: (e: unknown) => { (e as { target?: Geo }).target?.setSymbol?.(normalSymbol) },
}

useMaptalksMarker(layer, { coordinates: [121.495, 31.248], options: { symbol: normalSymbol }, events: hoverEvents })
useMaptalksMarker(layer, { coordinates: [121.5057, 31.2453], options: { symbol: normalSymbol }, events: hoverEvents })
useMaptalksMarker(layer, { coordinates: [121.515, 31.242], options: { symbol: normalSymbol }, events: hoverEvents })

const status = computed(() => (isReady.value ? '地图已创建（悬停高亮）' : '加载中…'))
</script>
