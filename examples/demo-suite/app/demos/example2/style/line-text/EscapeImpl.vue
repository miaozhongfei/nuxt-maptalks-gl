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
const { layer } = useMaptalksVectorLayer(map);
useMaptalksGeometry(layer, (mt) => {
  const line = new mt.LineString([[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]], {
    symbol: { lineColor: '#2563eb', lineWidth: 2 },
  });
  // oxlint-disable-next-line no-underscore-dangle
  (line as unknown as Record<string, unknown>)._textOnLine?.('Shanghai Lujiazui', { textFill: '#dc2626', textSize: 14, textDx: 30 });
  return line;
});
</script>
