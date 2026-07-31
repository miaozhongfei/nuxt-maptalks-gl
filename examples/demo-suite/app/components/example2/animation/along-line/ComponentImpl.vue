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
          :coordinates="pathCoords"
          :options="{ symbol: { lineColor: '#dc2626', lineWidth: 3, lineDasharray: [8, 4] } }"
        />
        <MaptalksMarker
          ref="mRef"
          :coordinates="startCoord"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startMove">开始沿路径动画</UButton>
      <UButton size="sm" variant="outline" @click="resetMarker">重置</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mRef = ref<MaptalksMarkerExposed | null>(null)
const lRef = ref<MaptalksLineStringExposed | null>(null)

const startCoord = [121.49, 31.25] as [number, number]
const pathCoords = [startCoord, [121.5057, 31.248] as [number, number], [121.52, 31.24] as [number, number]]

let animating = false
function startMove() {
  const marker = mRef.value?.geometry
  const line = lRef.value?.geometry
  if (!marker || animating) return
  if (typeof (marker as any).moveAlong === 'function') {
    (marker as any).moveAlong(line, { duration: 4000, easing: 'linear' })
    return
  }
  const path = pathCoords
  const duration = 4000
  const steps = 80
  const interval = duration / steps
  animating = true
  let step = 0
  const timer = setInterval(() => {
    step++
    if (step >= steps) { clearInterval(timer); animating = false; return }
    const t = step / steps
    const segIdx = Math.floor(t * (path.length - 1))
    const segT = (t * (path.length - 1)) - segIdx
    const from = path[segIdx]
    const to = path[Math.min(segIdx + 1, path.length - 1)]
    const lon = from[0] + (to[0] - from[0]) * segT
    const lat = from[1] + (to[1] - from[1]) * segT
    marker.setCoordinates([lon, lat])
  }, interval)
}
function resetMarker() { mRef.value?.geometry?.setCoordinates(startCoord) }
</script>
