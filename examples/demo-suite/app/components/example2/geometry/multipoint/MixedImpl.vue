<template>
  <div>
    <MaptalksMap
      ref="mc"
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
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
// 陆家嘴周边多点标注
useMaptalksMultiPoint(layer, {
  coordinates: [[121.49, 31.24], [121.5057, 31.2453], [121.52, 31.25]],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 } },
})

const status = computed(() => (map.value ? '地图已创建（MultiPoint 多点）' : '加载中…'))
</script>
