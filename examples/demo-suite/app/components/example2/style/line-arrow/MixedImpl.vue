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
// useMaptalksLineString：arrowStyle / arrowPlacement 为构造器顶级选项（与 symbol 平级）
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.5057, 31.255], [121.52, 31.245]],
  options: { arrowStyle: 'classic', arrowPlacement: 'vertex-firstlast', symbol: { lineColor: '#1bbc9b', lineWidth: 8 } },
})

const status = computed(() => (map.value ? '地图已创建（箭头线）' : '加载中…'))
</script>
