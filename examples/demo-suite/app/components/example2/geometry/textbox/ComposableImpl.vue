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
// 文本框 TextBox
useMaptalksTextBox(layer, {
  content: '文本框 TextBox',
  coordinates: [121.5057, 31.2453],
  width: 150,
  height: 44,
  symbol: { textFill: '#dc2626', textSize: 16 },
});
</script>
