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
// Marker 同时显示图片和文字标注
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: {
    properties: {
      name: 'Hello\nMapTalks',
    },
    symbol: [
      {
        markerFile: '/images/3.png',
        markerWidth: 28,
        markerHeight: 40,
      },
      {
        textFaceName: 'sans-serif',
        textName: '{name}',
        textSize: 14,
        textDy: 24,
      },
    ],
  },
});
</script>
