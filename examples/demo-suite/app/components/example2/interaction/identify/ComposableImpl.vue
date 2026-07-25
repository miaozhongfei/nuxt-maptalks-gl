<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UBadge variant="subtle" class="mt-2">点击地图或标记尝试点选</UBadge>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

type MaptalksGeometry = { setSymbol: (s: Record<string, unknown>) => void; getSymbol: () => Record<string, unknown> };

const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 };
const highlightSymbol = { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 20, markerHeight: 20 };

const geos: MaptalksGeometry[] = [];

useMaptalksMarker(layer, { coordinates: [121.495, 31.248], options: { symbol: normalSymbol } });
useMaptalksMarker(layer, { coordinates: [121.5057, 31.2453], options: { symbol: normalSymbol } });
useMaptalksMarker(layer, { coordinates: [121.515, 31.242], options: { symbol: normalSymbol } });

const highlighted = ref(-1);

useMaptalksEvents(map, {
  click: (e: { coordinate?: { x: number; y: number } }) => {
    if (!e.coordinate) return;
    highlighted.value = -1;
    const vl = toValue(layer) as unknown as { getGeometries?: () => MaptalksGeometry[] } | null;
    const all = vl?.getGeometries?.() ?? [];
    all.forEach((g) => {
      g.setSymbol?.(normalSymbol);
    });
    // find closest
    let minDist = Infinity;
    let minIdx = -1;
    all.forEach((g, i) => {
      const sym = g.getSymbol();
      const cx = (sym?.['markerDx'] as number) ?? 0;
      const cy = (sym?.['markerDy'] as number) ?? 0;
      const dist = Math.abs((e.coordinate?.x ?? 0) - cx) + Math.abs((e.coordinate?.y ?? 0) - cy);
      if (dist < minDist) { minDist = dist; minIdx = i; }
    });
    if (minIdx >= 0 && all[minIdx]) {
      (all[minIdx] as MaptalksGeometry).setSymbol?.(highlightSymbol);
      highlighted.value = minIdx;
    }
  },
});
</script>
