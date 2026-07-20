<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startMove">开始沿线动画</UButton>
      <UButton size="sm" variant="outline" @click="resetMarker">重置</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

let marker: unknown = null;
let line: unknown = null;

const startCoords: [number, number] = [121.49, 31.25];
const endCoords: [number, number] = [121.52, 31.24];

useMaptalksGeometry(layer, (mt) => {
  line = new mt.LineString([startCoords, [121.5057, 31.248], endCoords], {
    symbol: { lineColor: '#dc2626', lineWidth: 3, lineDasharray: [8, 4] },
  });
  marker = new mt.Marker(startCoords, {
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
  });
  return [line as any, marker as any];
});

function startMove() {
  if (!marker || !line) return;
  (marker as { moveAlong: (l: unknown, o: Record<string, unknown>) => void }).moveAlong(line as any, {
    duration: 4000,
    easing: 'linear',
  });
}

function resetMarker() {
  if (!marker) return;
  (marker as { setCoordinates: (c: [number, number]) => void }).setCoordinates(startCoords);
}
</script>
