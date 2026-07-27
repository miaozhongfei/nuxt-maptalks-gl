<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3">
      <UButtonGroup size="xs">
        <UButton color="red" @click="hideLayer">隐藏</UButton>
        <UButton color="green" @click="showLayer">显示</UButton>
        <UButton color="primary" @click="toggle">切换</UButton>
      </UButtonGroup>
      <UBadge color="primary" variant="subtle">{{ visible ? '可见' : '隐藏' }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

const visible = ref(true)
let layerRef: { show?: () => unknown; hide?: () => unknown } | null = null

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
  },
)

function showLayer() { visible.value = true; layerRef?.show?.() }
function hideLayer() { visible.value = false; layerRef?.hide?.() }
function toggle() { visible.value = !visible.value; if (visible.value) showLayer(); else hideLayer() }

onBeforeUnmount(() => { layerRef = null })
</script>
