<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-3 flex gap-2">
      <UButton size="sm" color="error" @click="setFill('#dc2626')">切换红色</UButton>
      <UButton size="sm" color="primary" @click="setFill('#2563eb')">切换蓝色</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
let geoRef: MaptalksGeometry | null = null
const { geometry } = useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 },
    }),
)
watch(
  () => toValue(geometry),
  (geo) => {
    geoRef = geo
  },
)
function setFill(color: string) {
  // 部分更新：updateSymbol 只改 markerFill（setSymbol 全量替换；均已建模）
  geoRef?.updateSymbol({ markerFill: color })
}

const status = computed(() => (isReady.value ? '地图已创建（响应式样式）' : '加载中…'))
</script>
