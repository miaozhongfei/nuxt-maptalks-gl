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
        :symbol="{ lineColor: '#2563eb', lineWidth: 4, lineDasharray: [10, 5], lineCap: 'round', lineJoin: 'round' }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
