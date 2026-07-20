<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="grid grid-cols-2 gap-3 mt-3 text-sm">
      <div class="rounded border border-default p-2">
        <span class="text-muted">坐标:</span> {{ coordText }}
      </div>
      <div class="rounded border border-default p-2">
        <span class="text-muted">像素:</span> {{ pointText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

const coordText = ref('--');
const pointText = ref('--');

useMaptalksEvents(map, {
  click: (e: { coordinate?: { x: number; y: number }; containerPoint?: { x: number; y: number } }) => {
    if (e.coordinate) coordText.value = `${e.coordinate.x.toFixed(6)}, ${e.coordinate.y.toFixed(6)}`;
    if (e.containerPoint) pointText.value = `${e.containerPoint.x.toFixed(0)}, ${e.containerPoint.y.toFixed(0)}`;
  },
  mousemove: (e: { coordinate?: { x: number; y: number }; containerPoint?: { x: number; y: number } }) => {
    if (e.coordinate) coordText.value = `${e.coordinate.x.toFixed(6)}, ${e.coordinate.y.toFixed(6)}`;
    if (e.containerPoint) pointText.value = `${e.containerPoint.x.toFixed(0)}, ${e.containerPoint.y.toFixed(0)}`;
  },
});
</script>
