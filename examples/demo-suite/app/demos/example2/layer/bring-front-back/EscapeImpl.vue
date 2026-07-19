<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="blue" @click="blueCtl.bringToFront()">蓝层置顶</UButton>
      <UButton size="xs" color="red" @click="redCtl.bringToBack()">红层置底</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

const { layer: blueLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(blueLayer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 28, markerHeight: 28 },
});

const { layer: redLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(redLayer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 },
});

const blueCtl = useMaptalksLayerControl(blueLayer);
const redCtl = useMaptalksLayerControl(redLayer);
</script>
