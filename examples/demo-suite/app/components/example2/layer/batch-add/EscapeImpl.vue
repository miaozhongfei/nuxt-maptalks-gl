<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

const { layer } = useMaptalksVectorLayer(map)

useMaptalksGeometry(layer, (mt) => new mt.Marker(
  [121.5057, 31.2453],
  { symbol: { textFaceName: '"microsoft yahei",arial,sans-serif', textName: '陆家嘴', textFill: '#34495e', textHorizontalAlignment: 'right', textSize: 40 } },
))

useMaptalksGeometry(layer, (mt) => new mt.LineString(
  [[121.5057, 31.2453], [121.5117, 31.2503]],
  { symbol: { lineColor: '#1bbc9b', lineWidth: 3 } },
))

const polyCoords = [
  [121.5057 - 0.018, 31.2453 + 0.004],
  [121.5057 + 0.006, 31.2453 + 0.004],
  [121.5057 + 0.006, 31.2453 - 0.001],
  [121.5057 - 0.018, 31.2453 - 0.001],
  [121.5057 - 0.018, 31.2453 + 0.004],
] as [number, number][]

useMaptalksGeometry(layer, (mt) => new mt.Polygon(
  polyCoords,
  { symbol: { lineColor: '#34495e', lineWidth: 2, polygonFill: 'rgb(135,196,240)', polygonOpacity: 0.6 } },
))

const holeOuter = [
  [121.49, 31.235],
  [121.53, 31.235],
  [121.53, 31.255],
  [121.49, 31.255],
  [121.49, 31.235],
] as [number, number][]

const holeInner = [
  [121.50, 31.240],
  [121.52, 31.240],
  [121.52, 31.250],
  [121.50, 31.250],
  [121.50, 31.240],
] as [number, number][]

useMaptalksGeometry(layer, (mt) => new mt.Polygon(
  [holeOuter, holeInner],
  { symbol: { lineColor: '#ea580c', lineWidth: 2, polygonFill: '#f97316', polygonOpacity: 0.5 } },
))

const status = computed(() => (isReady.value ? '地图已创建（批量图形已添加）' : '加载中…'))
</script>
