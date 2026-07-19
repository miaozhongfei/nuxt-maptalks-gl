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
        :coordinates="[121.49, 31.24]"
        :symbol="{ markerFile: 'https://cdn.maptalks.com/maptalks/img/marker/meng.png', markerWidth: 28, markerHeight: 28 }"
      />
      <MaptalksMarker
        :coordinates="[121.52, 31.25]"
        :symbol="{ markerFile: 'https://cdn.maptalks.com/maptalks/img/marker/plane.png', markerWidth: 28, markerHeight: 28 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
