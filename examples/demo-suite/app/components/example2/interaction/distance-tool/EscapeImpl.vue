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

watch(
  () => toValue(map),
  (m) => {
    if (!m) return;
    void import('maptalks-gl').then((mt) => {
      const DT = (mt as unknown as { DistanceTool: new (o: Record<string, unknown>) => { addTo: (m: unknown) => void } }).DistanceTool;
      new DT({}).addTo(m);
    });
  },
);
</script>
