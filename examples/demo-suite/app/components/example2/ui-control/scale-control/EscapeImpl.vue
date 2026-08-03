<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.control.Scale 直建 3 个官网布局（maxWidth × 米制/英制）（对应官网 10.16）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  // 官网 3 布局：左上双比例尺 / 右上米制 / 右下英制（不同 maxWidth）
  new mt.control.Scale({ position: 'top-left', maxWidth: 100, metric: true, imperial: true }).addTo(m as any)
  new mt.control.Scale({ position: 'top-right', maxWidth: 150, metric: true, imperial: false }).addTo(m as any)
  new mt.control.Scale({ position: 'bottom-right', maxWidth: 200, metric: false, imperial: true }).addTo(m as any)
}, { immediate: true })
</script>
