<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="mt-3 flex gap-2">
      <UButton size="sm" color="error" @click="setFill('#dc2626')">切换红色</UButton>
      <UButton size="sm" color="primary" @click="setFill('#2563eb')">切换蓝色</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
let geoRef: { setSymbol: (s: unknown) => void; updateSymbol: (s: unknown) => void } | null = null;
const { geometry } = useMaptalksGeometry(
  layer,
  (mt) =>
    new mt.Marker([121.5057, 31.2453], {
      symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 },
    }),
);
watch(
  () => toValue(geometry),
  (geo) => {
    if (geo)
      geoRef = geo as unknown as {
        setSymbol: (s: unknown) => void;
        updateSymbol: (s: unknown) => void;
      };
  },
);
function setFill(color: string) {
  // geoRef?.setSymbol({ markerType: 'ellipse', markerFill: color, markerWidth: 20, markerHeight: 20 });
  geoRef?.updateSymbol({ markerFill: color });
}
</script>
