<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.control.Attribution 直建 2 个官网布局（默认位置/自定义位置 × content）（对应官网 10.17）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  // 官网 2 布局：右下默认位置 / 右上自定义位置（数字值），不同 content
  new mt.control.Attribution({ position: 'bottom-right', content: 'One Attribution Control' }).addTo(m as any)
  new mt.control.Attribution({ position: { top: 5, right: 5 }, content: 'Another Attribution Control' }).addTo(m as any)
}, { immediate: true })
</script>
