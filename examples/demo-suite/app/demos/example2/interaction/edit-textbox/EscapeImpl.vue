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
useMaptalksGeometry(layer, (mt) =>
  new mt.TextBox('可编辑文本框', [121.5057, 31.2453], 200, 60, {
    symbol: { textFaceName: 'sans-serif', textFill: '#1f2937', textSize: 16, boxFill: '#fef3c7', boxOpacity: 0.8 },
    editable: true,
  }),
);
</script>
