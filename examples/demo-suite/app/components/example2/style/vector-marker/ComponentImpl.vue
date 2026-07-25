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
        :options="{ symbol: { markerType: 'diamond', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
