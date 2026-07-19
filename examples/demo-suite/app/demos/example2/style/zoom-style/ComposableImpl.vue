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
const cam = useMaptalksCamera(map);
const sym = computed(() => ({
  markerType: 'ellipse' as const,
  markerFill: '#2563eb',
  markerWidth: (cam.zoom.value ?? 13) * 2,
  markerHeight: (cam.zoom.value ?? 13) * 2,
}));
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  symbol: sym,
});
</script>
