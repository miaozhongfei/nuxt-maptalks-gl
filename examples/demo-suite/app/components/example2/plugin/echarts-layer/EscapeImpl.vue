<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">maptalks.e3 ECharts 3D 图层（对应官网 12.5）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  try {
    const e3 = await import('maptalks.e3')
    const E3Layer = (e3 as any).default || (e3 as any).E3Layer
    if (E3Layer) {
      const ecLayer = new E3Layer('e3')
      ecLayer.chartData = () => null
      ecLayer.addTo(m)
    }
  } catch {
    // Plugin may not be installed
  }
})
</script>
