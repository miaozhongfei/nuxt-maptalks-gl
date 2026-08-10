<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——官网原生方式：mt.control.Scale 直建 3 个官网布局（maxWidth × 米制/英制）（对应官网 10.16）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.control?.Scale) return
    // 官网 3 布局：左上双比例尺 / 右上米制 / 右下英制（不同 maxWidth）
    // 原生 control.Scale.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    new mt.control.Scale({ position: 'top-left', maxWidth: 100, metric: true, imperial: true }).addTo(m as never)
    new mt.control.Scale({ position: 'top-right', maxWidth: 150, metric: true, imperial: false }).addTo(m as never)
    new mt.control.Scale({ position: 'bottom-right', maxWidth: 200, metric: false, imperial: true }).addTo(m as never)
  },
  { immediate: true },
)

const status = computed(() => (isReady.value ? '地图已创建（比例尺可用）' : '加载中…'))
</script>
