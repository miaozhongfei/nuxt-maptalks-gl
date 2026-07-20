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
// textRotation 旋转文字标注
useMaptalksLabel(layer, {
  content: '旋转文字',
  coordinates: [121.5057, 31.2453],
  symbol: { textFill: '#2563eb', textSize: 18, textRotation: 45 },
});
</script>
