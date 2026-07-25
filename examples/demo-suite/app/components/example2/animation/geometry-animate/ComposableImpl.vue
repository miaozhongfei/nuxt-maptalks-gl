<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="moveRight">平移</UButton>
      <UButton size="sm" variant="outline" @click="moveBack">复位</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } },
});

const origin: [number, number] = [121.5057, 31.2453];

function moveRight() {
  const geo = toValue(geometry);
  if (!geo) return;
  (geo as unknown as { animate: (o: Record<string, unknown>, opts: Record<string, unknown>) => void }).animate(
    { coordinates: [121.52, 31.25] },
    { duration: 2000 },
  );
}

function moveBack() {
  const geo = toValue(geometry);
  if (!geo) return;
  (geo as unknown as { animate: (o: Record<string, unknown>, opts: Record<string, unknown>) => void }).animate(
    { coordinates: origin },
    { duration: 2000 },
  );
}
</script>
