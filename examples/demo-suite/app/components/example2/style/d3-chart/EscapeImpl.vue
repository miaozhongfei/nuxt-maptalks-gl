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
let mounted = true

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
    // requestAnimationFrame 确保 map 渲染循环就绪后获取 DOM
    const rafId = requestAnimationFrame(() => {
      if (!mounted || uiMarker !== uim) return
      try {
        const container = uim.getDOM()?.querySelector('.d3-container') as HTMLElement | null
        if (container) createD3Viz(container)
      } catch {
        /* UIMarker 可能在切换 tab 时已被销毁 */
      }
    })
    onBeforeUnmount(() => { cancelAnimationFrame(rafId) })
  },
)

onBeforeUnmount(() => {
  mounted = false
  try { uiMarker?.remove() } catch {
    // map 已销毁时 remove 可能报错
  }
})
</script>
