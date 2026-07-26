<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
  </div>
</template>

<script setup lang="ts">
import { createD3Viz } from './createD3Viz'

const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

const { uiMarker } = useMaptalksUIMarker(map, {
  options: {
    coordinates: [121.5057, 31.2453],
    content: '<div class="d3-container" style="width:600px;height:300px;background:#fff"></div>',
    single: false,
    draggable: false,
  },
})

watch(
  () => uiMarker.value,
  (uim) => {
    if (!uim) return
    const container = uim.getDOM()?.querySelector('.d3-container') as HTMLElement | null
    if (container) createD3Viz(container)
  },
  { immediate: true },
)
</script>
