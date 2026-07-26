<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" color="primary" variant="soft" @click="show">手动显示</UButton>
      <UButton size="sm" color="neutral" variant="soft" @click="hide">手动隐藏</UButton>
    </div>
    <p class="mt-1 text-xs text-muted">或直接点击地图上的 Marker 弹出/关闭</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

const vLayer = useMaptalksVectorLayer(map);
const { geometry } = useMaptalksMarker(vLayer.layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 20, markerHeight: 20 } },
});
const { show, hide } = useMaptalksMarkerInfoWindow(geometry, {
  options: { title: 'Composable InfoWindow', custom: true, content: '<div class=p-2>来自 composable</div>' },
});
</script>
