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
          :options="markerOptions"
        />
        <MaptalksLineString
          :coordinates="lineCoords"
          :options="lineOptions"
        />
        <MaptalksPolygon
          :coordinates="[polyCoords]"
          :options="polygonOptions"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>

<script setup lang="ts">
const markerOptions = { symbol: { textFaceName: '"microsoft yahei",arial,sans-serif', textName: '陆家嘴', textFill: '#34495e', textHorizontalAlignment: 'right', textSize: 40 } }
const lineCoords = [[121.5057, 31.2453], [121.5117, 31.2503]] as [number, number][]
const lineOptions = { symbol: { lineColor: '#1bbc9b', lineWidth: 3 } }
const polygonOptions = { symbol: { lineColor: '#34495e', lineWidth: 2, polygonFill: 'rgb(135,196,240)', polygonOpacity: 0.6 } }

const polyCoords = [
  [121.5057 - 0.018, 31.2453 + 0.004],
  [121.5057 + 0.006, 31.2453 + 0.004],
  [121.5057 + 0.006, 31.2453 - 0.001],
  [121.5057 - 0.018, 31.2453 - 0.001],
  [121.5057 - 0.018, 31.2453 + 0.004],
] as [number, number][]
</script>
