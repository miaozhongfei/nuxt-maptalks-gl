<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <!-- 原始折线（无平滑） -->
      <MaptalksLineString
        :coordinates="[[121.48, 31.235], [121.49, 31.25], [121.505, 31.24], [121.52, 31.255], [121.535, 31.242]]"
        :options="{ symbol: { lineColor: '#f00', lineWidth: 3 } }"
      />
      <!-- 曲线平滑（smoothness: 0.5） -->
      <MaptalksLineString
        :coordinates="[[121.48, 31.245], [121.49, 31.26], [121.505, 31.25], [121.52, 31.265], [121.535, 31.252]]"
        :options="{ smoothness: 0.5, symbol: { lineColor: '#34495e', lineWidth: 3 } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
