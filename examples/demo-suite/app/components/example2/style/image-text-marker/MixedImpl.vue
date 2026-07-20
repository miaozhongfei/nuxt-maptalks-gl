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
  symbol: {
    markerFile: 'https://cdn.maptalks.com/maptalks/img/marker/meng.png',
    markerWidth: 32,
    markerHeight: 32,
    textName: 'Label',
    textFill: '#fff',
    textSize: 12,
    textDy: -20,
  },
});
</script>
