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
useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Marker([121.49, 31.24], {
      symbol: [
        {
          markerFile: '/images/avatar.jpg',
          markerWidth: 29,
          markerHeight: 29,
          markerDy: -20,
        },
        {
          markerFile: '/images/marker.png',
        },
      ],
    }),
);
</script>
