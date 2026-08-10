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
// markerFill: { type: 'color-interpolate' } 按 properties.value 插值颜色 green→yellow→red
const sym = { markerWidth: 10, markerHeight: 10, markerType: 'ellipse', markerFill: { type: 'color-interpolate', property: 'value', stops: [[0, 'green'], [50, 'yellow'], [360, 'red']] }, markerLineWidth: 0 } as const
for (let i = 0; i < 28; i++) {
  useMaptalksMarker(layer, {
    coordinates: [121.49 + Math.random() * 0.04, 31.235 + Math.random() * 0.025],
    options: { symbol: sym, properties: { value: Math.floor(Math.random() * 360) } },
  })
}

const status = computed(() => (map.value ? '地图已创建（颜色插值）' : '加载中…'))
</script>
