<template>
  <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  new mt.control.Scale({ position: 'bottom-left' }).addTo(m)
})
</script>
