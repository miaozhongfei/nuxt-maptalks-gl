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
        :coordinates="[121.52, 31.25]"
        :options="{
          symbol: [
            {
              markerFile: '/images/avatar.jpg',
              markerWidth: 29,
              markerHeight: 29,
              markerDy: -20,
            },
            {
              markerFile: '/images/marker.png',
            },
          ],
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
