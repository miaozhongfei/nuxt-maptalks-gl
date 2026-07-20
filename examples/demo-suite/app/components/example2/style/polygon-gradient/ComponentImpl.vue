<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <MaptalksPolygon
        :coordinates="[[[121.495, 31.238], [121.515, 31.238], [121.515, 31.252], [121.495, 31.252], [121.495, 31.238]]]"
        :symbol="{ polygonFill: '#22c55e', polygonOpacity: 0.3, lineWidth: 2, polygonGradientProperty: 'gradient' }"
        :properties="{ gradient: { type: 'linear', colorStops: [[0, '#dc2626'], [0.5, '#fbbf24'], [1, '#2563eb']] } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
