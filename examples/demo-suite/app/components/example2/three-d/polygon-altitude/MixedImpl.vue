<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :pitch="55"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 三维矢量图层：开启海拔读取
const { layer } = useMaptalksVectorLayer(map, { options: { enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true } })
// 带 altitude 属性的 Polygon：在 pitch > 0 时悬浮在空中
useMaptalksPolygon(layer, {
  coordinates: [[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]],
  options: { properties: { altitude: 300 }, symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 } },
})

const status = computed(() => (map.value ? '地图已创建（面高度 300m）' : '加载中…'))
</script>
