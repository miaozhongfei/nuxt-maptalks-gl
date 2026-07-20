<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 陆家嘴周边多线 -->
      <MaptalksMultiLineString
        :coordinates="[[[121.49, 31.235], [121.50, 31.243]], [[121.51, 31.248], [121.52, 31.255]]]"
        :symbol="{ lineColor: '#7c3aed', lineWidth: 3 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
