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
        :symbol="p.hovered ? hoverSymbol : normalSymbol"
        @mouseenter="onHover(i, true)"
        @mouseleave="onHover(i, false)"
      />
    </MaptalksVectorLayer>
  </MaptalksMap>
</template>

<script setup lang="ts">
const points = reactive([
  { coords: [121.495, 31.248], hovered: false },
  { coords: [121.5057, 31.2453], hovered: false },
  { coords: [121.515, 31.242], hovered: false },
]);
const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 };
const hoverSymbol = { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 24, markerHeight: 24 };

function onHover(i: number, v: boolean) {
  points[i].hovered = v;
}
</script>
