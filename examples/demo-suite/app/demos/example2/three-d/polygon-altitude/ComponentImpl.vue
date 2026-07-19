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
      <MaptalksPolygon
        :coordinates="[[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]]"
        :properties="{ altitude: 300 }"
        :symbol="{ polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
