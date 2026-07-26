<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// textName / textPlacement 位于 symbol 内，与 lineColor / lineWidth 同级
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.515, 31.255], [121.53, 31.24], [121.5, 31.23], [121.49, 31.235]],
  options: { symbol: { lineColor: '#1bbc9b', lineWidth: 8, textName: 'Lujiazui', textPlacement: 'line', textSize: 20, textDy: -20 } },
});
</script>
