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
useMaptalksPolygon(layer, {
  coordinates: [[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]],
  options: { symbol: { polygonFill: '#22c55e', polygonOpacity: 0.3, polygonPatternFile: '/images/arrow.png', lineColor: '#16a34a', lineWidth: 2 } },
})

const status = computed(() => (map.value ? '地图已创建（面模式填充）' : '加载中…'))
</script>
