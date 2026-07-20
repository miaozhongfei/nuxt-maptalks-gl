<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <UButton size="xs" class="mt-3" @click="applyMask">应用遮罩（仅遮罩多边形内可见）</UButton>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

const { layer: markerLayer } = useMaptalksVectorLayer(map);
const pts = [
  [121.4997, 31.2493],
  [121.5057, 31.2513],
  [121.5117, 31.2493],
  [121.5097, 31.2461],
  [121.5037, 31.2449],
  [121.4987, 31.2465],
];
// 逃生舱：直接用 useMaptalksGeometry 创建原生 Marker
pts.forEach((c, i) => {
  useMaptalksGeometry(markerLayer, (mt) => new mt.Marker(
    c as [number, number],
    { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 }, id: `mk${i}` },
  ));
});

// 遮罩多边形
const maskRing = [
  [121.5027, 31.2483],
  [121.5087, 31.2483],
  [121.5087, 31.2443],
  [121.5027, 31.2443],
] as [number, number][];

async function applyMask() {
  const mt = await import('maptalks-gl');
  const poly = new mt.Polygon(maskRing);
  (toValue(markerLayer) as unknown as { setMask?: (g: unknown) => void } | null)
    ?.setMask?.(poly);
}
</script>
