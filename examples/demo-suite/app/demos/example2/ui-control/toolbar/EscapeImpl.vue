<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">原生 Toolbar 控件（右上角），对应官网 10.11。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  new mt.control.Toolbar({
    position: 'top-right',
    items: [
      { item: '放大', click: () => m.zoomIn() },
      { item: '缩小', click: () => m.zoomOut() },
    ],
  }).addTo(m)
})
</script>
