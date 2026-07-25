<template>
  <MaptalksMap
    ref="mapCmp"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);

const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 };
const hoverSymbol = { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 24, markerHeight: 24 };

useMaptalksMarker(layer, { coordinates: [121.495, 31.248], options: { symbol: normalSymbol } });
useMaptalksMarker(layer, { coordinates: [121.5057, 31.2453], options: { symbol: normalSymbol } });
useMaptalksMarker(layer, { coordinates: [121.515, 31.242], options: { symbol: normalSymbol } });
</script>
