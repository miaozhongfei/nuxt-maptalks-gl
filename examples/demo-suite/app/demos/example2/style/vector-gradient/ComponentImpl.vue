<template>
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
        :symbol="{
          markerType: 'ellipse',
          markerFill: { type: 'radial', colorStops: [[0, '#60a5fa'], [0.5, '#2563eb'], [1, '#1e3a8a']] },
          markerWidth: 30,
          markerHeight: 30,
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
