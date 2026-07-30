<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startEdit">开始编辑</UButton>
      <UButton size="sm" variant="outline" @click="endEdit">结束编辑</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
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
</script>
