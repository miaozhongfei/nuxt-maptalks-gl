<template>
  <div>
    <div
      ref="el"
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
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

// 始终在上面的红色图层（固定 zIndex）
const { layer: blueLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(blueLayer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 28, markerHeight: 28 },
});

// 始终在下层被动态设置的蓝色图层
const { layer: redLayer } = useMaptalksVectorLayer(map);
useMaptalksMarker(redLayer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 },
});

function setZ(n: number) {
  (toValue(blueLayer) as unknown as { setZIndex?: (n: number) => void } | null)?.setZIndex?.(n);
}
</script>
