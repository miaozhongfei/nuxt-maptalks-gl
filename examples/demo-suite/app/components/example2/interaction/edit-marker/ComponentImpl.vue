<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker
          ref="mRef"
          :coordinates="[121.5057, 31.2453]"
          :options="{ editable: true, draggable: false, symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="mRef?.geometry?.startEdit?.()">开始编辑</UButton>
      <UButton size="sm" variant="outline" @click="mRef?.geometry?.endEdit?.()">结束编辑</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mRef = ref<MaptalksMarkerExposed | null>(null)
</script>
