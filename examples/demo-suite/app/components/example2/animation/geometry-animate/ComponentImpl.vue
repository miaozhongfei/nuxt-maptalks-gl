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
        <MaptalksMarker
          ref="mRef"
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="moveRight">平移</UButton>
      <UButton size="sm" variant="outline" @click="moveBack">复位</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const mRef = ref<MaptalksMarkerExposed | null>(null)
const translateOffset: [number, number] = [0.02, 0]

// exposed geometry 是 Ref——toValue 解包后链式 bringToFront().animate
function moveRight() {
  toValue(mRef.value?.geometry)?.bringToFront()?.animate?.({ translate: translateOffset }, { duration: 2000, focus: true })
}
function moveBack() {
  toValue(mRef.value?.geometry)?.bringToFront()?.animate?.({ translate: [-translateOffset[0], 0] }, { duration: 2000, focus: true })
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（Geometry 平移动画）' : '加载中…'))
</script>
