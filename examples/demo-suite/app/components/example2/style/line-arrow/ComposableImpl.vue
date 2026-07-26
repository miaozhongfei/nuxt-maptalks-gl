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
// useMaptalksLineString：arrowStyle / arrowPlacement 为构造器顶级选项（与 symbol 平级）
useMaptalksLineString(layer, {
  coordinates: [[121.49, 31.235], [121.5057, 31.255], [121.52, 31.245]],
  options: { arrowStyle: 'classic', arrowPlacement: 'vertex-firstlast', symbol: { lineColor: '#1bbc9b', lineWidth: 8 } },
});
</script>
