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
    <UButton size="xs" class="mt-3" @click="applyMask">应用遮罩（仅遮罩多边形内可见）</UButton>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

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
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 },
    id: `mk${i}`,
  });
});

const { layer: maskLayer } = useMaptalksVectorLayer(map);
const { geometry: polygon } = useMaptalksPolygon(maskLayer, {
  coordinates: [
    [121.5027, 31.2483],
    [121.5087, 31.2483],
    [121.5087, 31.2443],
    [121.5027, 31.2443],
  ] as [number, number][],
  symbol: { lineWidth: 0, polygonFill: '#00000000' },
});

function applyMask() {
  (toValue(markerLayer) as unknown as { setMask?: (g: unknown) => void } | null)
    ?.setMask?.(toValue(polygon));
}
</script>
