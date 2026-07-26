<template>
  <MaptalksMap
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksVectorLayer>
      <MaptalksMarker :coordinates="[121.4832, 31.2453]" :options="{ symbol: symbol, properties: { heat: 1 } }" />
      <MaptalksMarker :coordinates="[121.4882, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.9 } }" />
      <MaptalksMarker :coordinates="[121.4932, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.8 } }" />
      <MaptalksMarker :coordinates="[121.4982, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.7 } }" />
      <MaptalksMarker :coordinates="[121.5032, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.6 } }" />
      <MaptalksMarker :coordinates="[121.5082, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.5 } }" />
      <MaptalksMarker :coordinates="[121.5132, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.4 } }" />
      <MaptalksMarker :coordinates="[121.5182, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.3 } }" />
      <MaptalksMarker :coordinates="[121.5232, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.2 } }" />
      <MaptalksMarker :coordinates="[121.5282, 31.2453]" :options="{ symbol: symbol, properties: { heat: 0.1 } }" />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>

<script setup lang="ts">
const symbol = {
  markerType: 'ellipse' as const,
  markerFill: 'rgb(216,115,149)',
  markerFillOpacity: { property: 'heat', type: 'identity' as const },
  markerLineWidth: 0,
  markerLineOpacity: 1,
  markerWidth: 40,
  markerHeight: 40,
};
</script>
