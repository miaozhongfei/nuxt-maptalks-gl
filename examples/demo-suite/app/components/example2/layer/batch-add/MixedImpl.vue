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
    <p class="text-sm mt-2 text-muted">5 个 Marker 通过组合模式批量添加到同一矢量图层</p>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);

const pts: [number, number][] = [
  [121.4957, 31.2453],
  [121.5057, 31.2553],
  [121.5157, 31.2453],
  [121.5057, 31.2353],
  [121.5057, 31.2453],
];
const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];

pts.forEach((c, i) => {
  useMaptalksMarker(layer, {
    coordinates: c,
    options: { symbol: { markerType: 'ellipse', markerFill: colors[i % colors.length], markerWidth: 14, markerHeight: 14 } },
  });
});
</script>
