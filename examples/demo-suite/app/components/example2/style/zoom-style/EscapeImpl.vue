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
let geoRef: MaptalksGeometry | null = null
const { geometry } = useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 26, markerHeight: 26 },
    }),
)

useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Marker([121.5557, 31.2453], {
      symbol: [
        {
          markerType: 'ellipse',
          markerWidth: {
            stops: [
              [7, 5],
              [14, 200],
            ],
          },
          markerHeight: {
            stops: [
              [7, 5],
              [14, 200],
            ],
          },
          markerFill: '#18987f',
          markerFillOpacity: 0.6,
          markerLineColor: '#34495e',
          markerLineWidth: 5,
        },
        {
          textFaceName: 'sans-serif',
          textName: 'MapTalks',
          textFill: '#fff',
          textSize: {
            stops: [
              [7, 2],
              [14, 30],
            ],
          },
        },
      ],
    }),
)

watch(
  () => toValue(geometry),
  (geo) => {
    geoRef = geo
  },
)
// 监听 zoom 变化来更新 marker 大小（updateSymbol 已建模——部分更新）
const cam = useMaptalksCamera(map)
watch(
  () => cam.zoom.value,
  (z) => {
    if (!geoRef || z === null || z === undefined) return
    const size = z * 2
    geoRef.updateSymbol({ markerWidth: size, markerHeight: size })
  },
)

const status = computed(() => (isReady.value ? '地图已创建（zoom 联动样式）' : '加载中…'))
</script>
