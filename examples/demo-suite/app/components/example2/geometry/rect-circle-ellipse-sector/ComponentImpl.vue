<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 矩形：左上角 + 宽 + 高（米） -->
      <MaptalksRectangle
        :coordinates="[121.488, 31.258]"
        :width="1200"
        :height="800"
        :options="{ symbol: { polygonFill: '#f59e0b', polygonOpacity: 0.3, lineColor: '#d97706', lineWidth: 2 } }"
      />
      <!-- 圆：中心 + 半径（米） -->
      <MaptalksCircle
        :coordinates="[121.5057, 31.2453]"
        :radius="600"
        :options="{ symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 } }"
      />
      <!-- 椭圆：中心 + 宽 + 高（米） -->
      <MaptalksEllipse
        :coordinates="[121.522, 31.252]"
        :width="1400"
        :height="700"
        :options="{ symbol: { polygonFill: '#a855f7', polygonOpacity: 0.3, lineColor: '#9333ea', lineWidth: 2 } }"
      />
      <!-- 扇形：中心 + 半径 + 起始角 + 结束角 -->
      <MaptalksSector
        :coordinates="[121.497, 31.238]"
        :radius="900"
        :start-angle="0"
        :end-angle="90"
        :options="{ symbol: { polygonFill: '#ef4444', polygonOpacity: 0.35, lineColor: '#dc2626', lineWidth: 2 } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
