<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3 w-72">
      <span class="text-sm w-28 shrink-0">透明度 {{ op.toFixed(2) }}</span>
      <USlider v-model="op" :min="0" :max="1" :step="0.05" />
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

const op = ref(1)
let layerRef: { setOpacity?: (v: number) => unknown } | null = null

watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    const mt = await import('maptalks-gl')
    const layer = new mt.VectorLayer('markers')
    const marker = new mt.Marker([121.5057, 31.2453], { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } })
    marker.addTo(layer)
    // 原生 VectorLayer.addTo 参数为原生 Map，与模块建模不兼容——逃生舱断言
    layer.addTo(m as never)
    layerRef = layer
    layer.setOpacity(op.value)
  },
)

watch(op, (v) => { layerRef?.setOpacity?.(v) })

onBeforeUnmount(() => { layerRef = null })

const status = computed(() => (isReady.value ? '地图已创建（可调透明度）' : '加载中…'))
</script>
