<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex gap-2 mt-3">
      <UButton size="sm" @click="fit">fitExtent 适配到多边形</UButton>
      <UButton size="sm" color="neutral" @click="cam.animateTo({ zoom: 11 })">缩小视野</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 11 });
useMaptalksTileLayer(map, { source: 'osm' });

// 目标多边形（用几何预设画出来）
const { layer } = useMaptalksVectorLayer(map);
const { geometry } = useMaptalksPolygon(layer, {
  coordinates: [
    [[-0.13, 51.5], [-0.1, 51.5], [-0.1, 51.51], [-0.13, 51.51], [-0.13, 51.5]],
  ],
  symbol: { polygonFill: '#2563eb', polygonOpacity: 0.3, lineColor: '#1d4ed8', lineWidth: 2 },
});

const cam = useMaptalksCamera(map);
// fitExtent：把视野适配到几何范围（getExtent 是原生只读调用）
function fit() {
  const g = toValue(geometry) as { getExtent?: () => unknown } | null;
  const ext = g?.getExtent?.();
  if (ext) cam.fitExtent(ext, 0);
}
</script>
