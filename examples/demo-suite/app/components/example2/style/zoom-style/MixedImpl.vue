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
const cam = useMaptalksCamera(map)
const sym = computed(() => ({
  markerType: 'ellipse' as const,
  markerFill: '#2563eb',
  markerWidth: (cam.zoom.value ?? 13) * 2,
  markerHeight: (cam.zoom.value ?? 13) * 2,
}))
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: sym },
})

useMaptalksMarker(layer, {
  coordinates: [121.5557, 31.2453],
  options: {
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
  },
})

const status = computed(() => (map.value ? '地图已创建（zoom 联动样式）' : '加载中…'))
</script>
