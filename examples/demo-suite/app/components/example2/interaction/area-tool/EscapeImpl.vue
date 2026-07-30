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

// 逃生舱：map 就绪后直调原生 maptalks.AreaTool，不依赖模块 wrapper
type RawAreaTool = { addTo: (m: Record<string, unknown>) => void }
type RawMt = { AreaTool?: new (opts?: Record<string, unknown>) => RawAreaTool }

watch(
  () => toValue(map),
  (m) => {
    if (!m) return
    import('maptalks-gl').then((mt) => {
      const Ctor = (mt as RawMt).AreaTool
      if (Ctor) new Ctor({}).addTo(m)
    })
  },
  { once: true },
)
</script>
