<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="add">添加 Marker 图层</UButton>
      <UButton size="xs" color="primary" @click="removeAll" :disabled="handles.length === 0"
        >移除全部</UButton
      >
      <UBadge color="primary" variant="subtle">图层数 {{ handles.length }}</UBadge>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const handles = ref<{ remove: () => void }[]>([])
const coords = [
  [121.4957, 31.2453],
  [121.5057, 31.2553],
  [121.5157, 31.2453],
  [121.5057, 31.2353],
]
let idx = 0

function add() {
  const { layer, remove } = useMaptalksVectorLayer(map)
  useMaptalksMarker(layer, {
    coordinates: coords[idx % coords.length] as [number, number],
    options: {
      symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 },
    },
  })
  handles.value.push({ remove })
  idx++
}

function removeAll() {
  handles.value.forEach((h) => h.remove())
  handles.value = []
}

const status = computed(() => (map.value ? '地图已创建（可动态增删图层）' : '加载中…'))
</script>
