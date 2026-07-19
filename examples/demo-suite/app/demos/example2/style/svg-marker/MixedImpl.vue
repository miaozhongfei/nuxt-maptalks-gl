<template>
  <MaptalksMap
    ref="mapCmp"
    base-layer="osm"
    :center="[121.5057, 31.2453]"
    :zoom="13"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// SVG 路径标注
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  symbol: {
    markerType: 'path',
    markerPath: 'M0 0 L12 0 L12 8 L8 8 L8 12 L4 8 L0 8 Z',
    markerPathWidth: 20,
    markerPathHeight: 20,
    markerFill: '#2563eb',
    markerLineColor: '#1e3a8a',
    markerLineWidth: 1,
  },
});
</script>
