<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ draggable: true, symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } }"
        />
        <MaptalksLineString
          :coordinates="[[121.49, 31.23], [121.5, 31.26], [121.52, 31.23]]"
          :options="{ draggable: true, symbol: { lineColor: '#16a34a', lineWidth: 4 } }"
        />
        <MaptalksPolygon
          :coordinates="[[[121.49, 31.238], [121.49, 31.252], [121.52, 31.252], [121.52, 31.238], [121.49, 31.238]]]"
          :options="{ draggable: true, symbol: { polygonFill: '#2563eb', fillOpacity: 0.3, lineColor: '#1e40af', lineWidth: 2 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
  </div>
</template>
