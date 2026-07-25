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
          symbol: {
            markerType: 'path',
            markerPath: tigerPath,
            markerPathWidth: 540,
            markerPathHeight: 580,
            markerWidth: 400,
            markerHeight: 400,
            markerDy: 200,
          },
        }"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>

<script setup lang="ts">
import { tigerPath } from './tiger-path';
</script>
