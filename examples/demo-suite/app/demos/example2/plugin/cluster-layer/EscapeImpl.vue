<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">maptalks.markercluster 点聚合（对应官网 12.3）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  try {
    await import('maptalks.markercluster')
    const mt = await import('maptalks-gl')
    const ClusterLayer = (mt as any).ClusterLayer
    if (ClusterLayer) {
      const cx = 121.5057; const cy = 31.2453
      const markers = Array.from({ length: 100 }, () => new mt.Marker([cx + (Math.random() - 0.5) * 0.05, cy + (Math.random() - 0.5) * 0.05]))
      new ClusterLayer('cluster', markers).addTo(m)
    }
  } catch {
    // Plugin may not be installed
  }
})
</script>
