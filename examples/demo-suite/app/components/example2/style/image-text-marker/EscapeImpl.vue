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
// Marker 同时显示图片和文字标注（工厂模式——逃生舱口径）
useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Marker([121.5057, 31.2453], {
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
    }),
);
</script>
