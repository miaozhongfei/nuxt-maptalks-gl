<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 }
const hoverSymbol = { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 24, markerHeight: 24 }

type Geo = { setSymbol: (s: Record<string, unknown>) => void }
const hoverEvents = {
  mouseenter: (e: unknown) => { (e as { target?: Geo }).target?.setSymbol?.(hoverSymbol) },
  mouseout: (e: unknown) => { (e as { target?: Geo }).target?.setSymbol?.(normalSymbol) },
}

useMaptalksGeometry(layer, (mt) => new mt.Marker([121.495, 31.248], { symbol: normalSymbol }), { events: hoverEvents })
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], { symbol: normalSymbol }), { events: hoverEvents })
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.515, 31.242], { symbol: normalSymbol }), { events: hoverEvents })
</script>
