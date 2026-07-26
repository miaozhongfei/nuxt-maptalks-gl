<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" color="primary" variant="soft" @click="markerRef?.openInfoWindow()">手动显示</UButton>
      <UButton size="sm" color="neutral" variant="soft" @click="markerRef?.closeInfoWindow()">手动隐藏</UButton>
    </div>
    <p class="mt-1 text-xs text-muted">或直接点击地图上的 Marker 弹出/关闭</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const markerRef = ref<{ openInfoWindow: () => void; closeInfoWindow: () => void } | null>(null)
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const layer = new mt.VectorLayer('v').addTo(m)
  const marker = new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#10b981', markerWidth: 18, markerHeight: 18 } })
  marker.setInfoWindow({ title: 'Marker 信息', content: '<div style=padding:4px>点击弹出的信息框</div>' })
  marker.addTo(layer)
  markerRef.value = marker as unknown as typeof markerRef['value']
})
</script>
