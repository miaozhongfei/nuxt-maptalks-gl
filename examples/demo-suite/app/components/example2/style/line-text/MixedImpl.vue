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
// textName / textPlacement 位于 symbol 内，与 lineColor / lineWidth 同级
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.515, 31.255], [121.53, 31.24], [121.5, 31.23], [121.49, 31.235]],
  options: { symbol: { lineColor: '#1bbc9b', lineWidth: 8, textName: 'Lujiazui', textPlacement: 'line', textSize: 20, textDy: -20 } },
})

const status = computed(() => (map.value ? '地图已创建（沿线文字）' : '加载中…'))
</script>
