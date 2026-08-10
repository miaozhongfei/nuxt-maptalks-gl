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
import { tigerPath } from './tiger-path'

const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksVectorLayer(map)
// SVG 路径标注：Raphael.js tiger
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: {
    markerType: 'path',
    markerPath: tigerPath,
    markerPathWidth: 540,
    markerPathHeight: 580,
    markerWidth: 400,
    markerHeight: 400,
    markerDy: 200,
  } },
})

const status = computed(() => (map.value ? '地图已创建（SVG 路径标注）' : '加载中…'))
</script>
