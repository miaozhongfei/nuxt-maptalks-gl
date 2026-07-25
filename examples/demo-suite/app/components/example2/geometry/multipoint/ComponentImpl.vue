<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 陆家嘴周边多点标注 -->
      <MaptalksMultiPoint
        :coordinates="[[121.49, 31.24], [121.5057, 31.2453], [121.52, 31.25]]"
        :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
