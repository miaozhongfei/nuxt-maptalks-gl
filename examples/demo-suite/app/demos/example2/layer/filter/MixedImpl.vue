<template>
  <div>
    <MaptalksMap
      ref="mapCmp"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" @click="filterKind('a')">仅显示 a</UButton>
      <UButton size="xs" @click="filterKind('b')">仅显示 b</UButton>
      <UButton size="xs" color="green" @click="showAll">显示全部</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);

const markers: { coord: [number, number]; kind: string; color: string }[] = [
  { coord: [121.4887, 31.2453], kind: 'a', color: '#2563eb' },
  { coord: [121.5057, 31.2553], kind: 'a', color: '#2563eb' },
  { coord: [121.5227, 31.2453], kind: 'a', color: '#2563eb' },
  { coord: [121.4957, 31.2493], kind: 'b', color: '#dc2626' },
  { coord: [121.5157, 31.2493], kind: 'b', color: '#dc2626' },
  { coord: [121.5057, 31.2393], kind: 'b', color: '#dc2626' },
];
markers.forEach((m) => {
  useMaptalksMarker(layer, {
    coordinates: m.coord,
    symbol: { markerType: 'ellipse', markerFill: m.color, markerWidth: 14, markerHeight: 14 },
    properties: { kind: m.kind },
  });
});

function filterKind(kind: string) {
  const vl = toValue(layer) as unknown as { getGeometries?: () => unknown[] } | null;
  const geos = vl?.getGeometries?.() ?? [];
  geos.forEach((g: {
    setVisible?: (v: boolean) => void;
    getProperties?: () => Record<string, unknown>;
  }) => {
    g.setVisible?.(g.getProperties?.()?.kind === kind);
  });
}

function showAll() {
  const vl = toValue(layer) as unknown as { getGeometries?: () => unknown[] } | null;
  const geos = vl?.getGeometries?.() ?? [];
  geos.forEach((g: { setVisible?: (v: boolean) => void }) => g.setVisible?.(true));
}
</script>
