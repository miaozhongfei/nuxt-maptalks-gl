<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    />
    <div class="mt-3 flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm">horizontalAlignment</span>
        <USelect v-model="hAlign" :items="['middle', 'left', 'right']" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm">verticalAlignment</span>
        <USelect v-model="vAlign" :items="['middle', 'top', 'bottom']" size="sm" />
      </div>
    </div>
    <p class="text-sm text-muted mt-2">
      逃生舱——官网原生方式：直接改 uiMarker.options（零重建）（对应官网 10.8）。
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const hAlign = ref<'middle' | 'left' | 'right'>('middle')
const vAlign = ref<'middle' | 'top' | 'bottom'>('middle')

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

// 窄类型：options 直接改（零重建）、addTo 收拢
let uim: { options: Record<string, unknown>; addTo: (m: MaptalksMap) => void } | null = null
watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    if (!mt.ui?.UIMarker) return
    // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    const layer = new mt.VectorLayer('v').addTo(m as never)
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#000', markerWidth: 5, markerHeight: 5 },
    }).addTo(layer)
    // UIMarker：内容 + 初始对齐（原生构造经窄类型断言收拢）
    uim = new mt.ui.UIMarker([121.5057, 31.2453], {
      content:
        '<div style="background:#2563eb;color:#fff;padding:4px 8px;border-radius:4px;white-space:nowrap">maptalks</div>',
      horizontalAlignment: 'middle',
      verticalAlignment: 'middle',
    }) as unknown as { options: Record<string, unknown>; addTo: (m: MaptalksMap) => void }
    uim.addTo(m as never)
  },
  { immediate: true },
)

// 官网原生方式：下拉变化 → 直接改 uiMarker.options，零重建
watch([hAlign, vAlign], ([h, v]) => {
  if (!uim) return
  uim.options.horizontalAlignment = h
  uim.options.verticalAlignment = v
})

const status = computed(() => (isReady.value ? '地图已创建（UIMarker 对齐可切换）' : '加载中…'))
</script>
