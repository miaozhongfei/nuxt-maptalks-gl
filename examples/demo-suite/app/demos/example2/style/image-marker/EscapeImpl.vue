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
useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerFile: 'https://cdn.maptalks.com/maptalks/img/marker/meng.png', markerWidth: 28, markerHeight: 28 },
}));
</script>
