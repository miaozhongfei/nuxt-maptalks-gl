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
        :options="{ symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 }, properties: { draggable: true } }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
