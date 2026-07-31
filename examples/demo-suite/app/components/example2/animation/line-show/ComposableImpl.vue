<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UButton size="sm" variant="outline" class="mt-3" @click="animateShow">animateShow 展示</UButton>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const path = [[121.49, 31.25], [121.495, 31.248], [121.5057, 31.2453], [121.516, 31.242], [121.522, 31.24]] as [number, number][]
const { geometry } = useMaptalksLineString(layer, {
  coordinates: path,
  options: { visible: false, arrowStyle: 'classic', arrowPlacement: 'vertex-last', symbol: { lineColor: '#dc2626', lineWidth: 4 } },
})

function animateShow() {
  const geo = toValue(geometry)
  geo?.hide()
  geo?.animateShow({ duration: 1500, easing: 'out' })
}
</script>
