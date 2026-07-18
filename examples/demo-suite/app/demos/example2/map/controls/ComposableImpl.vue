<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });
// 四个控件 composable，一行一个
useMaptalksZoom(map, { position: 'top-left' });
useMaptalksScale(map, { position: 'bottom-left' });
useMaptalksCompass(map, { position: 'top-right' });
useMaptalksAttribution(map, { position: 'bottom-right' });
</script>
