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
        :symbol="{ markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16, markerDx: 15, markerDy: 15 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
