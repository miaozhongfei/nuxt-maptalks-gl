<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
import { createD3Viz } from './createD3Viz'

const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

let uiMarker: { remove: () => void; getDOM: () => HTMLElement } | null = null

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    const uim = new (mt as unknown as { ui: { UIMarker: new (c: [number, number], o: Record<string, unknown>) => { addTo: (m: unknown) => void; remove: () => void; getDOM: () => HTMLElement } } }).ui.UIMarker(
      [121.5057, 31.2453],
      {
        content: '<div class="d3-container" style="width:600px;height:300px;background:#fff"></div>',
        single: false,
        draggable: false,
      },
    )
    uim.addTo(m)
    uiMarker = uim
    // setTimeout needed because UIMarker DOM may not be immediately available
    setTimeout(() => {
      const container = uim.getDOM()?.querySelector('.d3-container') as HTMLElement | null
      if (container) createD3Viz(container)
    }, 100)
  },
)

onBeforeUnmount(() => {
  uiMarker?.remove()
})
</script>
