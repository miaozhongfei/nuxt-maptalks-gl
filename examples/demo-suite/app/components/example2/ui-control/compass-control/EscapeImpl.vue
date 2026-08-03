<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.control.Compass 直建 4 个官网布局（pitch/bearing 旋转展示）（对应官网 10.15）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 60, bearing: 30 })
useMaptalksTileLayer(map, { source: 'osm' })

watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  // 官网 4 布局：左上 / 右上 / 右下 / 自定义位置（maptalks-gl position 对象需数字值）
  new mt.control.Compass({ position: 'top-left' }).addTo(m)
  new mt.control.Compass({ position: 'top-right' }).addTo(m)
  new mt.control.Compass({ position: 'bottom-right' }).addTo(m)
  new mt.control.Compass({ position: { bottom: 20, left: 20 } }).addTo(m)
}, { immediate: true })
</script>
