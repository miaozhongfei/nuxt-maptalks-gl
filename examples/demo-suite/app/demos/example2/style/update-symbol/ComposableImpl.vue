<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-3 flex gap-2">
      <UButton size="sm" color="destructive" @click="sym.markerFill = '#dc2626'">切换红色</UButton>
      <UButton size="sm" color="primary" @click="sym.markerFill = '#2563eb'">切换蓝色</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
const sym = reactive({
  markerType: 'ellipse',
  markerFill: '#2563eb',
  markerWidth: 20,
  markerHeight: 20,
});
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  symbol: computed(() => ({ ...sym })),
});
</script>
