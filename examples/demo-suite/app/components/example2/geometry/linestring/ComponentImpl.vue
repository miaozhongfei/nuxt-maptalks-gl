<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 陆家嘴黄浦江东岸折线 -->
      <MaptalksLineString
        :coordinates="[[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]]"
        :symbol="{ lineColor: '#dc2626', lineWidth: 3 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
