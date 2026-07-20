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
        :symbol="{ markerFile: 'https://cdn.maptalks.com/maptalks/img/marker/meng.png', markerWidth: 28, markerHeight: 28 }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
