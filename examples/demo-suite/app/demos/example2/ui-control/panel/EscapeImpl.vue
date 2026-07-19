<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">原生 Panel 面板控件（左上角），对应官网 10.12。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  new mt.control.Panel({
    position: 'top-left',
    content: '<div style="padding:10px;background:white;border:1px solid #e5e7eb;border-radius:6px;font-size:14px"><h3 style="margin:0 0 4px">面板</h3><p style="margin:0">这是 Panel 控件</p></div>',
  }).addTo(m)
})
</script>
