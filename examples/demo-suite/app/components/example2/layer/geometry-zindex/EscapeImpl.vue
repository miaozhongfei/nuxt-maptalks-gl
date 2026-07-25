<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" @click="swapZIndex">交换 zIndex（蓝=20 红=5）</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

const { geometry: blueGeo } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453] as [number, number],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } },
});

const { geometry: redGeo } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453] as [number, number],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 10, markerHeight: 10 } },
});

let redOnTop = false;
function swapZIndex() {
  redOnTop = !redOnTop;
  const bz = redOnTop ? 5 : 10;
  const rz = redOnTop ? 10 : 5;
  (toValue(blueGeo) as unknown as { setZIndex?: (n: number) => void } | null)?.setZIndex?.(bz);
  (toValue(redGeo) as unknown as { setZIndex?: (n: number) => void } | null)?.setZIndex?.(rz);
}
</script>
