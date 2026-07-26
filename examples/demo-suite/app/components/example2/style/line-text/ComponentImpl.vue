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
        :coordinates="[[121.49, 31.235], [121.515, 31.255], [121.53, 31.24], [121.5, 31.23], [121.49, 31.235]]"
        :options="{
          symbol: {
            lineColor: '#1bbc9b',
            lineWidth: 8,
            textName: 'Lujiazui',
            textPlacement: 'line',
            textSize: 20,
            textDy: -20,
          },
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
