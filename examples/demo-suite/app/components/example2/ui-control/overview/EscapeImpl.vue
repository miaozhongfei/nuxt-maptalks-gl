<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-2 flex items-center gap-2">
      <UButton size="sm" variant="outline" @click="() => { ov?.maxmize() }">展开鹰眼</UButton>
      <UButton size="sm" variant="outline" @click="() => { ov?.minimize() }">收起鹰眼</UButton>
    </div>
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.control.Overview 直建鹰眼 + maxmize/minimize 按钮（对应官网 10.13）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 45 })
useMaptalksTileLayer(map, { source: 'osm' })

// 原生实例引用（maxmize/minimize 直接调用）
let ov: { maxmize?: () => void; minimize?: () => void } | null = null

watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  // 鹰眼配置：右下角 + 小地图尺寸 + 默认展开
  ov = new mt.control.Overview({ position: 'bottom-right', size: [150, 110], maximize: true })
  ov.addTo(m as any)
}, { immediate: true })
</script>
