<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksLineString
          :coordinates="[center, endPt]"
          :options="{
            arrowStyle: 'classic',
            arrowPlacement: 'vertex-last',
            symbol: { lineColor: '#dc2626', lineWidth: 4 },
          }"
        />
        <MaptalksMarker
          ref="mRef"
          :coordinates="center"
          :options="{
            symbol: {
              markerType: 'ellipse',
              markerFill: '#2563eb',
              markerWidth: 18,
              markerHeight: 18,
            },
          }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startMove">开始</UButton>
      <UButton size="sm" variant="outline" @click="resetMarker">重置</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const mRef = ref<MaptalksMarkerExposed | null>(null)
const center: [number, number] = [121.5057, 31.2453]
const translateOffset: [number, number] = [0.025, 0.018]
const endPt: [number, number] = [center[0] + translateOffset[0], center[1] + translateOffset[1]]

// exposed geometry 是 Ref——toValue 解包后链式 bringToFront().animate（官网核心 API：translate 平移 + focus）
function startMove() {
  toValue(mRef.value?.geometry)
    ?.bringToFront()
    ?.animate?.({ translate: translateOffset }, { duration: 2000, focus: true })
}
function resetMarker() {
  toValue(mRef.value?.geometry)?.setCoordinates(center)
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（沿线平移动画）' : '加载中…'))
</script>
