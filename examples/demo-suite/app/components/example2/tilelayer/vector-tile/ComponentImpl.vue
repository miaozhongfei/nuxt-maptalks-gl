<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="2"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <!-- VectorTileLayer 作为底图，加载 MVT 矢量瓦片并用 style 规则渲染 -->
    <MaptalksVectorTileLayer :options="vtOptions" />
  </MaptalksMap>
</template>

<script setup lang="ts">
// 面要素填充与线要素描边的矢量瓦片样式规则
const vtStyle = [
  {
    // 面要素填充
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
];
const vtOptions = {
  urlTemplate: 'https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf',
  style: vtStyle,
};
</script>
