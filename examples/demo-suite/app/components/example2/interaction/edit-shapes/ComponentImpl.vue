<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksCircle
          ref="cRef"
          :coordinates="[121.502, 31.248]"
          :radius="300"
          :options="{ editable: true, symbol: { lineColor: '#dc2626', lineWidth: 2, polygonFill: '#ef4444', polygonOpacity: 0.3 } }"
        />
        <MaptalksEllipse
          ref="eRef"
          :coordinates="[121.51, 31.248]"
          :width="400"
          :height="200"
          :options="{ editable: true, symbol: { lineColor: '#2563eb', lineWidth: 2, polygonFill: '#3b82f6', polygonOpacity: 0.3 } }"
        />
        <MaptalksRectangle
          ref="rRef"
          :coordinates="[121.502, 31.24]"
          :width="400"
          :height="300"
          :options="{ editable: true, symbol: { lineColor: '#22c55e', lineWidth: 2, polygonFill: '#4ade80', polygonOpacity: 0.3 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startEdit">开始编辑</UButton>
      <UButton size="sm" variant="outline" @click="endEdit">结束编辑</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const cRef = ref<MaptalksCircleExposed | null>(null)
const eRef = ref<MaptalksEllipseExposed | null>(null)
const rRef = ref<MaptalksRectangleExposed | null>(null)

function startEdit() {
  cRef.value?.geometry?.startEdit?.()
  eRef.value?.geometry?.startEdit?.()
  rRef.value?.geometry?.startEdit?.()
}
function endEdit() {
  cRef.value?.geometry?.endEdit?.()
  eRef.value?.geometry?.endEdit?.()
  rRef.value?.geometry?.endEdit?.()
}
</script>
