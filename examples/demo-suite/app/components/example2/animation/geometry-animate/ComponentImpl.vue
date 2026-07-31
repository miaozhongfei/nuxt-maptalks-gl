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
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="moveRight">平移</UButton>
      <UButton size="sm" variant="outline" @click="moveBack">复位</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mRef = ref<MaptalksMarkerExposed | null>(null)
const translateOffset: [number, number] = [0.02, 0]

function moveRight() {
  mRef.value?.geometry?.bringToFront()?.animate?.({ translate: translateOffset }, { duration: 2000, focus: true })
}
function moveBack() {
  mRef.value?.geometry?.bringToFront()?.animate?.({ translate: [-translateOffset[0], 0] }, { duration: 2000, focus: true })
}
</script>
