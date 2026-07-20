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
        :symbol="{ lineColor: '#2563eb', lineWidth: 3 }"
      />
      <!-- 中点 Marker -->
      <MaptalksMarker
        :coordinates="[121.5057, 31.2453]"
        :symbol="{ markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 12, markerHeight: 12 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
