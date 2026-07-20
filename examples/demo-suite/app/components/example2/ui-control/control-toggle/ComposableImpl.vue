<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="toggleZoom">{{ zoomVisible ? '隐藏' : '显示' }} Zoom 控件</UButton>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const zoomVisible = ref(true)
function toggleZoom() {
  zoomVisible.value = !zoomVisible.value
  if (zoomVisible.value) {
    const m = toValue(map); if (!m) return
    import('maptalks-gl').then(mt => { new mt.control.Zoom({ position: 'top-left' }).addTo(m) })
  }
}
onMounted(async () => {
  const m = toValue(map); if (!m) return
  const mt = await import('maptalks-gl')
  new mt.control.Zoom({ position: 'top-left' }).addTo(m)
})
</script>
