<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="toggleZoom">{{ zoomVisible ? '隐藏' : '显示' }} Zoom 控件</UButton>
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
const zoomVisible = ref(true)
function toggleZoom() {
  zoomVisible.value = !zoomVisible.value
  if (zoomVisible.value) {
    const m = map.value; if (!m) return
    import('maptalks-gl').then(mt => { new mt.control.Zoom({ position: 'top-left' }).addTo(m) })
  }
}
onMounted(async () => {
  const m = map.value; if (!m) return
  const mt = await import('maptalks-gl')
  new mt.control.Zoom({ position: 'top-left' }).addTo(m)
})
</script>
