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
        :coordinates="[121.5157, 31.2453]"
        :options="{
          symbol: {
            textName: 'm4',
            textSize: 14,
            markerFile: '/images/m4.png',
            markerHorizontalAlignment: 'middle',
            markerVerticalAlignment: 'middle',
          },
        }"
      />
      <MaptalksMarker
        :coordinates="[121.4957, 31.2453]"
        :options="{
          symbol: {
            textName: 'm5',
            textSize: 14,
            markerFile: '/images/m5.png',
            markerHorizontalAlignment: 'middle',
            markerVerticalAlignment: 'middle',
          },
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
