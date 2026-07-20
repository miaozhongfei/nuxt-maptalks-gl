<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">原生 import maptalks.mapboxgl 创建 MapboxglLayer（对应官网 12.1）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  try {
    await import('maptalks.mapboxgl')
    const mt = await import('maptalks-gl')
    const MapboxglLayer = (mt as any).MapboxglLayer
    if (MapboxglLayer) {
      new MapboxglLayer('mbgl', { glOptions: { style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' } }).addTo(m)
    }
  } catch {
    // Plugin may not be installed
  }
})
</script>
