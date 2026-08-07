<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { layer } = useMaptalksVectorLayer(map, {
  options: { globalCompositeOperation: 'difference' },
})

const colors = ['#f00', '#0f0', '#00f']
Array.from({ length: 50 }, () => {
  const x = 121.5057 + (Math.random() - 0.5) * 0.055 * 0.5
  const y = 31.2453 + (Math.random() - 0.5) * 0.03 * 0.5
  return [x, y] as [number, number]
}).forEach((c) => {
  useMaptalksMarker(layer, {
    coordinates: c,
    options: {
      symbol: { markerType: 'ellipse', markerFill: colors[Math.floor(Math.random() * 3)], markerFillOpacity: 1, markerLineWidth: 1, markerLineColor: colors[Math.floor(Math.random() * 3)], markerWidth: 70, markerHeight: 70 },
    },
  })
})

const status = computed(() => (map.value ? '地图已创建（difference 混合模式）' : '加载中…'))
</script>
