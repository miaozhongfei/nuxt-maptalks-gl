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
        :coordinates="[[121.49, 31.235], [121.5057, 31.255], [121.52, 31.245]]"
        :options="{
          arrowStyle: 'classic',
          arrowPlacement: 'vertex-firstlast',
          symbol: { lineColor: '#1bbc9b', lineWidth: 8 },
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>
