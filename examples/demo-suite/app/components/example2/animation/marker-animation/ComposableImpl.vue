<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="grow">变大</UButton>
      <UButton size="sm" variant="outline" @click="shrink">变小</UButton>
      <UButton size="sm" variant="outline" @click="reset">重置</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } },
})

function grow() { toValue(geometry)?.animate?.({ symbol: { markerWidth: 40, markerHeight: 40 } }, { duration: 1500 }) }
function shrink() { toValue(geometry)?.animate?.({ symbol: { markerWidth: 20, markerHeight: 20 } }, { duration: 1500 }) }
function reset() { toValue(geometry)?.updateSymbol({ markerWidth: 20, markerHeight: 20 }) }
</script>
