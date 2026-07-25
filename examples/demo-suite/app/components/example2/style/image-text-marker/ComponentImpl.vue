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
        :options="{
          properties: {
            name: 'Hello\nMapTalks',
          },
          symbol: [
            {
              markerFile: '/images/3.png',
              markerWidth: 28,
              markerHeight: 40,
            },
            {
              textFaceName: 'sans-serif',
              textName: '{name}',
              textSize: 14,
              textDy: 24,
            },
          ],
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
