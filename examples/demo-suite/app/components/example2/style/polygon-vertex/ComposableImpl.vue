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
// markerPlacement: 'vertex' + textPlacement: 'vertex' 在每个端点展示椭圆 Marker 和文字
useMaptalksPolygon(layer, {
  coordinates: [[[121.49, 31.253], [121.515, 31.253], [121.515, 31.238], [121.49, 31.238], [121.49, 31.253]]],
  options: { symbol: {
    lineColor: '#34495e',
    lineWidth: 2,
    polygonFill: 'rgb(135,196,240)',
    polygonOpacity: 0.6,
    markerType: 'ellipse',
    markerFill: '#1bbc9b',
    markerLineColor: '#000',
    markerWidth: 30,
    markerHeight: 30,
    markerPlacement: 'vertex',
    textName: 'A',
    textPlacement: 'vertex',
    textFill: '#fff',
  } },
})

const status = computed(() => (isReady.value ? '地图已创建（顶点标注）' : '加载中…'))
</script>
