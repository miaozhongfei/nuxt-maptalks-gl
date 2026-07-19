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
        v-for="(p, i) in points"
        :key="i"
        :coordinates="p.coords"
        :symbol="p.highlighted ? highlightSymbol : normalSymbol"
        @click="onSelect(i)"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>

<script setup lang="ts">
const points = [
  { coords: [121.495, 31.248], highlighted: false },
  { coords: [121.5057, 31.2453], highlighted: false },
  { coords: [121.515, 31.242], highlighted: false },
];
const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 };
const highlightSymbol = { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 20, markerHeight: 20 };

function onSelect(i: number) {
  points.forEach((p, idx) => { p.highlighted = idx === i; });
}
</script>
