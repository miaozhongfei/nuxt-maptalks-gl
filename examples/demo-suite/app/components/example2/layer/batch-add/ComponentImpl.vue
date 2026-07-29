<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { textFaceName: '\"microsoft yahei\",arial,sans-serif', textName: '陆家嘴', textFill: '#34495e', textHorizontalAlignment: 'right', textSize: 40 } }"
        />
        <MaptalksLineString
          :coordinates="[[121.5057, 31.2453], [121.5117, 31.2503]]"
          :options="{ symbol: { lineColor: '#1bbc9b', lineWidth: 3 } }"
        />
        <MaptalksPolygon
          :coordinates="[polyCoords]"
          :options="{ symbol: { lineColor: '#34495e', lineWidth: 2, polygonFill: 'rgb(135,196,240)', polygonOpacity: 0.6 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const polyCoords = [
  [121.5057 - 0.018, 31.2453 + 0.004],
  [121.5057 + 0.006, 31.2453 + 0.004],
  [121.5057 + 0.006, 31.2453 - 0.001],
  [121.5057 - 0.018, 31.2453 - 0.001],
  [121.5057 - 0.018, 31.2453 + 0.004],
] as [number, number][]
</script>
