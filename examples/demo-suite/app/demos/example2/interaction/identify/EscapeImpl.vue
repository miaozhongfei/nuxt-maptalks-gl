<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-2">
      <UBadge variant="subtle">已选中: {{ selected }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

const selected = ref<string>('无');

type Geo = { setSymbol: (s: Record<string, unknown>) => void; getProperties?: () => Record<string, unknown> };

const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 };
const highlightSymbol = { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 20, markerHeight: 20 };

let geos: Geo[] = [];

useMaptalksGeometry(layer, (mt) => {
  const g = [
    new mt.Marker([121.495, 31.248], { symbol: normalSymbol, properties: { name: 'A' } }),
    new mt.Marker([121.5057, 31.2453], { symbol: normalSymbol, properties: { name: 'B' } }),
    new mt.Marker([121.515, 31.242], { symbol: normalSymbol, properties: { name: 'C' } }),
  ];
  geos = g as unknown as Geo[];
  return (g as unknown as { addTo: (l: unknown) => void }[])[0];
});

useMaptalksEvents(map, {
  click: (e: { coordinate: { x: number; y: number } }) => {
    geos.forEach((g) => g.setSymbol(normalSymbol));
    selected.value = '无';
    // simplified: use first geometry as selected target
    const idx = geos.findIndex(() => true);
    if (geos.length > 0) {
      geos.forEach((g, i) => {
        if (i === idx) {
          g.setSymbol(highlightSymbol);
          selected.value = (g.getProperties?.() as Record<string, unknown>)?.name as string ?? '?';
        }
      });
    }
  },
});
</script>
