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
        <MaptalksPolygon
          ref="pRef"
          :coordinates="[[[121.49, 31.255], [121.52, 31.255], [121.52, 31.238], [121.49, 31.238], [121.49, 31.255]]]"
          :options="{ editable: true, symbol: { lineColor: '#2563eb', lineWidth: 3, polygonFill: '#22c55e', polygonOpacity: 0.3 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="pRef?.geometry?.startEdit?.()">开始编辑</UButton>
      <UButton size="sm" variant="outline" @click="pRef?.geometry?.endEdit?.()">结束编辑</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const pRef = ref<MaptalksPolygonExposed | null>(null)
</script>
