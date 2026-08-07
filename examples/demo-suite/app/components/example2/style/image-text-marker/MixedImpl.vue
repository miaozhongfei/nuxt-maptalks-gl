<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksVectorLayer(map)
// Marker 同时显示图片和文字标注
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: {
    properties: {
      name: 'Hello\nMapTalks',
    },
    symbol: [
      {
        markerFile: '/images/3.png',
        markerWidth: 28,
        markerHeight: 40,
      },
      {
        textFaceName: 'sans-serif',
        textName: '{name}',
        textSize: 14,
        textDy: 24,
      },
    ],
  },
})

const status = computed(() => (map.value ? '地图已创建（图文标注）' : '加载中…'))
</script>
