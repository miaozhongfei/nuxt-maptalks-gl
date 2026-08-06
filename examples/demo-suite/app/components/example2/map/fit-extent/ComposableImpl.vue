<template>
  <div>
    <div
      ref="el"
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
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 11 })
useMaptalksTileLayer(map, { source: 'osm' })

// 目标多边形（用几何预设画出来）
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksPolygon(layer, {
  coordinates: [
    [[121.49, 31.24], [121.52, 31.24], [121.52, 31.255], [121.49, 31.255], [121.49, 31.24]],
  ],
  options: { symbol: { polygonFill: '#2563eb', polygonOpacity: 0.3, lineColor: '#1d4ed8', lineWidth: 2 } },
})

const cam = useMaptalksCamera(map)
// fitExtent：把视野适配到几何范围（getExtent 为原生只读调用，已建模）
function fit() {
  const ext = toValue(geometry)?.getExtent()
  if (ext) cam.fitExtent(ext, 0)
}

const status = computed(() => (isReady.value ? '地图已创建（fitExtent 适配到多边形）' : '加载中…'))
</script>
