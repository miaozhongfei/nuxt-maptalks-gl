<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      :pitch="60"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" variant="outline" @click="start">开始</UButton>
      <UButton size="sm" variant="outline" @click="stop">停止</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { bearing, point } from '@turf/turf'

import { COORDINATES, MARKER_FILE } from './constants'

const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
const { geometry: lineGeo } = useMaptalksLineString(layer, {
  coordinates: COORDINATES,
  options: { symbol: { lineWidth: 5, lineColor: '#facc15' } },
})
const { geometry: markerGeo } = useMaptalksMarker(layer, {
  coordinates: COORDINATES[0] as [number, number],
  options: { symbol: { markerFile: MARKER_FILE, markerWidth: 50, markerHeight: 50 } },
})

const animating = ref(false)
const stopped = ref(false)

function start() {
  if (animating.value) return
  animating.value = true
  stopped.value = false
  const line = toValue(lineGeo)
  const m = toValue(map)
  if (!line || !m || !line.animateShow) return
  line.hide()
  const marker = toValue(markerGeo)
  if (marker) marker.setCoordinates(COORDINATES[0])
  let preCoord: { x: number; y: number } | null = null
  line.animateShow({ duration: 30000, easing: 'linear' }, (...args: unknown[]) => {
    if (stopped.value) return
    // animateShow 帧回调第二参为当前坐标（原生签名未建模——窄断言）
    const coord = args[1] as { x: number; y: number }
    const mk = toValue(markerGeo)
    if (!mk) return
    mk.setCoordinates(coord)
    // 用户交互中不跟随（isInteracting 豁免）
    if (!m.isInteracting()) {
      m.setCenter(coord)
      m.setZoom(16)
      if (preCoord) {
        const b = bearing(point([preCoord.x, preCoord.y]), point([coord.x, coord.y]))
        if (Math.abs(m.getBearing() - b) >= 5) m.setBearing(b)
      }
    }
    preCoord = { x: coord.x, y: coord.y }
  })
}

function stop() {
  stopped.value = true
  animating.value = false
  toValue(lineGeo)?.hide()
  const marker = toValue(markerGeo)
  if (marker) marker.setCoordinates(COORDINATES[0])
}

onBeforeUnmount(() => {
  stop()
})

const status = computed(() => (map.value ? '地图已创建（相机跟随 Marker）' : '加载中…'))
</script>
