<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { tigerPath } from './tiger-path'

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
// SVG 路径标注：Raphael.js tiger（逃生舱口径）
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: {
    markerType: 'path',
    markerPath: tigerPath,
    markerPathWidth: 540,
    markerPathHeight: 580,
    markerWidth: 400,
    markerHeight: 400,
    markerDy: 200,
  },
}))

const status = computed(() => (isReady.value ? '地图已创建（SVG 路径标注）' : '加载中…'))
</script>
