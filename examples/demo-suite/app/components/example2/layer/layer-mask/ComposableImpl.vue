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

// 散布 6 个 Marker 在图层中央区域
const { layer: markerLayer } = useMaptalksVectorLayer(map);
const pts = [
  [121.4997, 31.2493],
  [121.5057, 31.2513],
  [121.5117, 31.2493],
  [121.5097, 31.2461],
  [121.5037, 31.2449],
  [121.4987, 31.2465],
];
pts.forEach((c, i) => {
  useMaptalksMarker(markerLayer, {
    coordinates: c as [number, number],
    options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 } },
    id: `mk${i}`,
  });
});

// 遮罩图层：多边形包围中央 3 个点
const { layer: maskLayer } = useMaptalksVectorLayer(map);
const { geometry: polygon } = useMaptalksPolygon(maskLayer, {
  coordinates: [
    [121.5027, 31.2483],
    [121.5087, 31.2483],
    [121.5087, 31.2443],
    [121.5027, 31.2443],
  ] as [number, number][],
  options: { symbol: { lineWidth: 0, polygonFill: '#00000000' } },
});

function applyMask() {
  // 窄类型转换调用原生 setMask，传入遮罩多边形
  (toValue(markerLayer) as unknown as { setMask?: (g: unknown) => void } | null)
    ?.setMask?.(toValue(polygon));
}
</script>
