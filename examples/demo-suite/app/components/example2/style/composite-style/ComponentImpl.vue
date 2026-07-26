<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 线 -->
      <MaptalksLineString
        :coordinates="[[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]]"
        :options="{ symbol: { lineColor: '#2563eb', lineWidth: 3 } }"
      />
      <!-- 中点 Marker -->
      <MaptalksMarker
        :coordinates="[121.5057, 31.2453]"
        :options="{ symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 12, markerHeight: 12 } }"
      />
      <!-- 组合样式 Marker（同心圆波纹） -->
      <MaptalksMarker
        :coordinates="[121.5457, 31.2453]"
        :options="{
          symbol: [
            { markerType: 'ellipse', markerFill: '#fff', markerFillOpacity: 1, markerWidth: 20, markerHeight: 20, markerLineWidth: 0 },
            { markerType: 'ellipse', markerFill: '#1bc8ff', markerFillOpacity: 0.9, markerWidth: 55, markerHeight: 55, markerLineWidth: 0 },
            { markerType: 'ellipse', markerFill: '#0096cd', markerFillOpacity: 0.8, markerWidth: 91, markerHeight: 91, markerLineWidth: 0 },
            { markerType: 'ellipse', markerFill: '#0096cd', markerFillOpacity: 0.3, markerWidth: 130, markerHeight: 130, markerLineWidth: 0 },
            { markerType: 'ellipse', markerFill: '#0096cd', markerFillOpacity: 0.2, markerWidth: 172, markerHeight: 172, markerLineWidth: 0 },
          ],
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
