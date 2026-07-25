<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <MaptalksLineString
        :coordinates="[[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]]"
        :options="{ symbol: { lineWidth: 8, lineGradientProperty: 'lineGradient' }, properties: { lineGradient: { type: 'linear', colorStops: [[0, '#dc2626'], [0.5, '#fbbf24'], [1, '#2563eb']] } } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
