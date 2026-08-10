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
// 陆家嘴周边多线
useMaptalksMultiLineString(layer, {
  coordinates: [[[121.49, 31.235], [121.50, 31.243]], [[121.51, 31.248], [121.52, 31.255]]],
  options: { symbol: { lineColor: '#7c3aed', lineWidth: 3 } },
})

const status = computed(() => (map.value ? '地图已创建（MultiLineString 多线）' : '加载中…'))
</script>
