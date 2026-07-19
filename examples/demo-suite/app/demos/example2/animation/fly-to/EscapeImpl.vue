<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="flyNear">飞行到陆家嘴</UButton>
      <UButton size="sm" variant="outline" @click="flyFar">飞回远处</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
);

watch(
  () => toValue(map),
  (m) => {
    if (!m) return;
    void import('maptalks-gl').then((mt) => {
      (m as unknown as { flyTo: (o: Record<string, unknown>) => void }).flyTo?.(
        new (mt as unknown as { Camera: new (m: unknown) => { flyTo: (o: Record<string, unknown>) => void } }).Camera(m).flyTo({ center: [121.5057, 31.2453], zoom: 13 }),
      );
    });
  },
);
</script>
