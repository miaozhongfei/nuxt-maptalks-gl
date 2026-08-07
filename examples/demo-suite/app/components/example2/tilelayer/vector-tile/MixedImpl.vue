<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="2"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 面要素填充与线要素描边的矢量瓦片样式规则
const vtStyle = [
  {
    // 面要素填充（@maptalks/vt 规则格式：symbol 顶层）
    filter: ['==', '$type', 'Polygon'],
    renderPlugin: { type: 'fill', dataConfig: { type: 'fill' } },
    symbol: { polygonFill: '#60a5fa', polygonOpacity: 0.6 },
  },
  {
    // 线要素描边
    filter: ['==', '$type', 'LineString'],
    renderPlugin: { type: 'line', dataConfig: { type: 'line' } },
    symbol: { lineColor: '#1e3a8a', lineWidth: 1 },
  },
]
// VectorTileLayer 加载 MVT 矢量瓦片并用 style 规则渲染
useMaptalksVectorTileLayer(map, {
  options: {
    urlTemplate: 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf',
    style: vtStyle,
  },
})

const status = computed(() => (map.value ? '地图已创建（MVT 矢量瓦片）' : '加载中…'))
</script>
