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
let zoomCtl: any = null
function toggleZoom() {
  zoomVisible.value = !zoomVisible.value
  const m = toValue(map); if (!m) return
  if (zoomVisible.value) {
    import('maptalks-gl').then(mt => { zoomCtl = new mt.control.Zoom({ position: 'top-left' }); zoomCtl.addTo(m) })
  } else if (zoomCtl) {
    zoomCtl.remove(); zoomCtl = null
  }
}
onMounted(async () => {
  const m = toValue(map); if (!m) return
  const mt = await import('maptalks-gl')
  zoomCtl = new mt.control.Zoom({ position: 'top-left' })
  zoomCtl.addTo(m)
})
</script>
