<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startMove">开始</UButton>
      <UButton size="sm" variant="outline" @click="resetMarker">重置</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const center: [number, number] = [121.5057, 31.2453]
const translateOffset: [number, number] = [0.025, 0.018]
const endPt: [number, number] = [center[0] + translateOffset[0], center[1] + translateOffset[1]]

// 逃生舱：工厂模式创建箭头线 + Marker
useMaptalksGeometry(layer, (mt) =>
  new mt.LineString([center, endPt], { arrowStyle: 'classic', arrowPlacement: 'vertex-last', symbol: { lineColor: '#dc2626', lineWidth: 4 } }),
)
const { geometry: markerGeo } = useMaptalksGeometry(layer, (mt) =>
  new mt.Marker(center, { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } }),
)

function startMove() {
  // 官网核心 API：animate({ translate: [dx, dy] }, { duration, focus })
  toValue(markerGeo)?.animate?.({ translate: translateOffset }, { duration: 2000, focus: true })
}
function resetMarker() {
  toValue(markerGeo)?.setCoordinates(center)
}
</script>
