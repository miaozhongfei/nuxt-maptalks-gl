<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.245]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
useMaptalksMarker(layer, {
  coordinates: [121.49, 31.24],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 }, properties: { category: 'A' } },
});
useMaptalksMarker(layer, {
  coordinates: [121.52, 31.25],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 18, markerHeight: 18 }, properties: { category: 'B' } },
});
useMaptalksMarker(layer, {
  coordinates: [121.49, 31.242],
  options: { symbol: { textName: 'A 类', textFill: '#2563eb', textSize: 14, textDx: 0, textDy: 10 } },
});
useMaptalksMarker(layer, {
  coordinates: [121.52, 31.252],
  options: { symbol: { textName: 'B 类', textFill: '#dc2626', textSize: 14, textDx: 0, textDy: 10 } },
});
</script>
