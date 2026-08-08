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

// 逃生舱：工厂模式创建 VectorLayer + 三种可编辑形状
const { layer } = useMaptalksVectorLayer(map)
const { geometry: gCircle } = useMaptalksGeometry(layer, (mt) =>
  new mt.Circle([121.502, 31.248], 300, { editable: true, symbol: { lineColor: '#dc2626', lineWidth: 2, polygonFill: '#ef4444', polygonOpacity: 0.3 } }),
)
const { geometry: gEllipse } = useMaptalksGeometry(layer, (mt) =>
  new mt.Ellipse([121.51, 31.248], 400, 200, { editable: true, symbol: { lineColor: '#2563eb', lineWidth: 2, polygonFill: '#3b82f6', polygonOpacity: 0.3 } }),
)
const { geometry: gRect } = useMaptalksGeometry(layer, (mt) =>
  new mt.Rectangle([121.502, 31.24], 400, 300, { editable: true, symbol: { lineColor: '#22c55e', lineWidth: 2, polygonFill: '#4ade80', polygonOpacity: 0.3 } }),
)

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
