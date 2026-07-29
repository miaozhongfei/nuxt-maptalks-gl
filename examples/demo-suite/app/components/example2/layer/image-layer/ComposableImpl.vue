<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 });
useMaptalksTileLayer(map, { source: 'osm' });

useMaptalksImageLayer(map, {
  images: [
    { url: '/images/1.png', extent: [121.49, 31.235, 121.51, 31.255], opacity: 1 },
    { url: '/images/2.png', extent: [121.5, 31.24, 121.52, 31.26], opacity: 0.4 },
  ],
});
</script>
