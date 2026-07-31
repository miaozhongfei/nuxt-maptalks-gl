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
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="grow">变大</UButton>
      <UButton size="sm" variant="outline" @click="shrink">变小</UButton>
      <UButton size="sm" variant="outline" @click="reset">重置</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mRef = ref<MaptalksMarkerExposed | null>(null)

function grow() { mRef.value?.geometry?.animate?.({ symbol: { markerWidth: 40, markerHeight: 40 } }, { duration: 1500 }) }
function shrink() { mRef.value?.geometry?.animate?.({ symbol: { markerWidth: 20, markerHeight: 20 } }, { duration: 1500 }) }
function reset() { mRef.value?.geometry?.updateSymbol({ markerWidth: 20, markerHeight: 20 }) }
</script>
