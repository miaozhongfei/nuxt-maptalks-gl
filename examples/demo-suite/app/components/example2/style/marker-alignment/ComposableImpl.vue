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
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
// m4：右偏，markerHorizontalAlignment / markerVerticalAlignment 对齐演示
useMaptalksMarker(layer, {
  coordinates: [121.5157, 31.2453],
  options: { symbol: {
    textName: 'm4',
    textSize: 14,
    markerFile: '/images/m4.png',
    markerHorizontalAlignment: 'middle',
    markerVerticalAlignment: 'middle',
  } },
})
// m5：左偏
useMaptalksMarker(layer, {
  coordinates: [121.4957, 31.2453],
  options: { symbol: {
    textName: 'm5',
    textSize: 14,
    markerFile: '/images/m5.png',
    markerHorizontalAlignment: 'middle',
    markerVerticalAlignment: 'middle',
  } },
})

const status = computed(() => (isReady.value ? '地图已创建（对齐标注）' : '加载中…'))
</script>
