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
          :coordinates="ring"
          :options="{ visible: false, symbol: { lineColor: '#2563eb', lineWidth: 3, polygonFill: '#22c55e', polygonOpacity: 0.4 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <UButton size="sm" variant="outline" class="mt-3" @click="animateShow">animateShow 展示</UButton>
  </div>
</template>

<script setup lang="ts">
const pRef = ref<MaptalksPolygonExposed | null>(null)
const ring = [[[121.49, 31.255], [121.52, 31.255], [121.52, 31.238], [121.49, 31.238], [121.49, 31.255]]] as [number, number][][]

function animateShow() {
  const geo = pRef.value?.geometry
  geo?.hide()
  geo?.animateShow?.({ duration: 1500, easing: 'out' })
}
</script>
