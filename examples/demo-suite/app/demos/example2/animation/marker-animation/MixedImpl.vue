<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="grow">变大</UButton>
      <UButton size="sm" variant="outline" @click="shrink">变小</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 },
});

function grow() {
  const geo = toValue(geometry);
  if (!geo) return;
  (geo as unknown as { animate: (o: Record<string, unknown>, opts: Record<string, unknown>) => void }).animate(
    { symbol: { markerWidth: 40, markerHeight: 40 } },
    { duration: 1500 },
  );
}

function shrink() {
  const geo = toValue(geometry);
  if (!geo) return;
  (geo as unknown as { animate: (o: Record<string, unknown>, opts: Record<string, unknown>) => void }).animate(
    { symbol: { markerWidth: 20, markerHeight: 20 } },
    { duration: 1500 },
  );
}
</script>
