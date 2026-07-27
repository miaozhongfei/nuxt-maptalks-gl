<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3 w-72">
      <span class="text-sm w-28 shrink-0">透明度 {{ op.toFixed(2) }}</span>
      <USlider v-model="op" :min="0" :max="1" :step="0.05" />
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
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
    layer.addTo(m)
    layerRef = layer
    layer.setOpacity(op.value)
  },
)

watch(op, (v) => { layerRef?.setOpacity?.(v) })

onBeforeUnmount(() => { layerRef = null })
</script>
