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
        <MaptalksLineString
          ref="lRef"
          :coordinates="path"
          :options="{ visible: false, arrowStyle: 'classic', arrowPlacement: 'vertex-last', symbol: { lineColor: '#dc2626', lineWidth: 4 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <UButton size="sm" variant="outline" class="mt-3" @click="animateShow">animateShow 展示</UButton>
  </div>
</template>

<script setup lang="ts">
const lRef = ref<MaptalksLineStringExposed | null>(null)
const path = [[121.49, 31.25], [121.495, 31.248], [121.5057, 31.2453], [121.516, 31.242], [121.522, 31.24]] as [number, number][]

function animateShow() {
  const geo = lRef.value?.geometry
  geo?.hide()
  geo?.animateShow?.({ duration: 1500, easing: 'out' })
}
</script>
