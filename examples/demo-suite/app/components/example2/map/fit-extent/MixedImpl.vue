<template>
  <div>
    <!-- 组合：组件建图 + 几何/相机 composable -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="11"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex gap-2 mt-3">
      <UButton size="sm" @click="fit">fitExtent 适配到多边形</UButton>
      <UButton size="sm" color="neutral" @click="cam.animateTo({ zoom: 11 })">缩小视野</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksPolygon(layer, {
  coordinates: [
    [[121.49, 31.24], [121.52, 31.24], [121.52, 31.255], [121.49, 31.255], [121.49, 31.24]],
  ],
  options: { symbol: { polygonFill: '#16a34a', polygonOpacity: 0.3, lineColor: '#15803d', lineWidth: 2 } },
})
const cam = useMaptalksCamera(map)
// fitExtent：把视野适配到几何范围（getExtent 已建模）
function fit() {
  const ext = toValue(geometry)?.getExtent()
  if (ext) cam.fitExtent(ext, 0)
}

const status = computed(() => (map.value ? '地图已创建（fitExtent 适配到多边形）' : '加载中…'))
</script>
