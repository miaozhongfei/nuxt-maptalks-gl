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
// 文字标签 Label
useMaptalksLabel(layer, {
  content: '文字标签 Label',
  coordinates: [121.5057, 31.2453],
  properties: { draggable: true },
  symbol: { textFill: '#dc2626', textSize: 16 },
});
</script>
