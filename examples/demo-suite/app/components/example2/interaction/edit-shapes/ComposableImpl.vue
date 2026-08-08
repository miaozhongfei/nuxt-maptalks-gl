<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startEdit">开始编辑</UButton>
      <UButton size="sm" variant="outline" @click="endEdit">结束编辑</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const { geometry: gCircle } = useMaptalksCircle(layer, {
  coordinates: [121.502, 31.248],
  radius: 300,
  options: { editable: true, symbol: { lineColor: '#dc2626', lineWidth: 2, polygonFill: '#ef4444', polygonOpacity: 0.3 } },
})
const { geometry: gEllipse } = useMaptalksEllipse(layer, {
  coordinates: [121.51, 31.248],
  width: 400,
  height: 200,
  options: { editable: true, symbol: { lineColor: '#2563eb', lineWidth: 2, polygonFill: '#3b82f6', polygonOpacity: 0.3 } },
})
const { geometry: gRect } = useMaptalksRectangle(layer, {
  coordinates: [121.502, 31.24],
  width: 400,
  height: 300,
  options: { editable: true, symbol: { lineColor: '#22c55e', lineWidth: 2, polygonFill: '#4ade80', polygonOpacity: 0.3 } },
})

function startEdit() {
  toValue(gCircle)?.startEdit?.()
  toValue(gEllipse)?.startEdit?.()
  toValue(gRect)?.startEdit?.()
}
function endEdit() {
  toValue(gCircle)?.endEdit?.()
  toValue(gEllipse)?.endEdit?.()
  toValue(gRect)?.endEdit?.()
}

const status = computed(() => (isReady.value ? '地图已创建（可编辑形状）' : '加载中…'))
</script>
