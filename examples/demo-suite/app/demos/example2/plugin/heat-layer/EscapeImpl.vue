<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">maptalks.heatmap 热力图层（对应官网 12.2）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  try {
    await import('maptalks.heatmap')
    const mt = await import('maptalks-gl')
    const HeatLayer = (mt as any).HeatLayer
    if (HeatLayer) {
      const cx = 121.5057; const cy = 31.2453
      const data = Array.from({ length: 200 }, () => ({ coordinates: [cx + (Math.random() - 0.5) * 0.05, cy + (Math.random() - 0.5) * 0.05], count: Math.random() * 100 }))
      new HeatLayer('heat', data, { radius: 30 }).addTo(m)
    }
  } catch {
    // Plugin may not be installed
  }
})
</script>
