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
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" @click="setZ(10)">蓝层 zIndex=10</UButton>
      <UButton size="xs" @click="setZ(20)">蓝层 zIndex=20</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);

const { layer: blueLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(blueLayer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 28, markerHeight: 28 } },
});

const { layer: redLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(redLayer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 } },
});

function setZ(n: number) {
  (toValue(blueLayer) as unknown as { setZIndex?: (n: number) => void } | null)?.setZIndex?.(n);
}
</script>
