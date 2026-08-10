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
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksVectorLayer(map)
// linear 渐变
useMaptalksRectangle(layer, {
  coordinates: [121.485, 31.255],
  width: 600,
  height: 600,
  options: { symbol: { polygonFill: { type: 'linear', colorStops: [[0, '#fff'], [0.5, '#fff27e'], [1, '#f87e4b']] }, polygonOpacity: 1, lineColor: '#fff' } },
})
// linear + places 渐变
useMaptalksRectangle(layer, {
  coordinates: [121.493, 31.255],
  width: 600,
  height: 600,
  options: { symbol: { polygonFill: { type: 'linear', places: [0, 0, 1, 1], colorStops: [[0, '#fff'], [0.5, '#fff27e'], [1, '#f87e4b']] }, polygonOpacity: 1, lineColor: '#fff' } },
})
// radial 渐变
useMaptalksRectangle(layer, {
  coordinates: [121.5057, 31.2453],
  width: 600,
  height: 600,
  options: { symbol: { polygonFill: { type: 'radial', colorStops: [[0, 'rgba(216,115,149,0)'], [0.5, 'rgba(216,115,149,1)'], [1, 'rgba(216,115,149,1)']] }, polygonOpacity: 1, lineWidth: 0 } },
})
// radial + places 渐变
useMaptalksRectangle(layer, {
  coordinates: [121.513, 31.2453],
  width: 600,
  height: 600,
  options: { symbol: { polygonFill: { type: 'radial', places: [0.5, 0.5, 1, 1, 1, 0.1], colorStops: [[0, '#1bbc9b'], [0.55, 'rgb(135,196,240)'], [1, '#34495e']] }, polygonOpacity: 1, lineColor: '#fff' } },
})

const status = computed(() => (map.value ? '地图已创建（面渐变填充）' : '加载中…'))
</script>
