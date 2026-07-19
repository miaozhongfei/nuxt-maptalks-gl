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
    <p class="text-sm mt-2 text-muted">globalCompositeOperation: 'xor' — 重叠区域反色</p>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const { layer: bottomLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(bottomLayer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 30, markerHeight: 30 },
});

const { layer: topLayer } = useMaptalksVectorLayer(map, {
  options: { globalCompositeOperation: 'xor' },
});
useMaptalksMarker(topLayer, {
  coordinates: [121.5055, 31.2451],
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 30, markerHeight: 30 },
});
</script>
