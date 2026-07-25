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
    <p class="text-sm mt-2 text-muted">collision: true — 3 个同坐标 Marker 自动碰撞避让</p>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const { layer } = useMaptalksVectorLayer(map, {
  options: { collision: true },
});

const colors = ['#2563eb', '#dc2626', '#16a34a'];
colors.forEach((c) => {
  useMaptalksMarker(layer, {
    coordinates: [121.5057, 31.2453] as [number, number],
    options: { symbol: { markerType: 'ellipse', markerFill: c, markerWidth: 18, markerHeight: 18 } },
  });
});
</script>
