<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    :pitch="55"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer :options="{ enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true }">
      <MaptalksMarker
        :coordinates="[121.5057, 31.2453]"
        :properties="{ altitude: 500 }"
        :symbol="{ markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
