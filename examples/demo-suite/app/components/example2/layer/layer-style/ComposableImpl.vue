<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="blue" @click="applyBlue">统一蓝色</UButton>
      <UButton size="xs" color="red" @click="applyRed">统一红色</UButton>
      <UButton size="xs" color="green" @click="applyGreen">统一绿色</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

// 4 个不同颜色的 Marker
const markers: { coord: [number, number]; color: string }[] = [
  { coord: [121.4887, 31.2453], color: '#2563eb' },
  { coord: [121.5057, 31.2553], color: '#dc2626' },
  { coord: [121.5227, 31.2453], color: '#16a34a' },
  { coord: [121.5057, 31.2353], color: '#ca8a04' },
];
markers.forEach((m) => {
  useMaptalksMarker(layer, {
    coordinates: m.coord,
    options: { symbol: { markerType: 'ellipse', markerFill: m.color, markerWidth: 14, markerHeight: 14 } },
  });
});

function applyStyle(fill: string) {
  // 窄类型转换调用 VectorLayer 的 setStyle，批量覆盖所有图形的 symbol
  (toValue(layer) as unknown as { setStyle?: (s: Record<string, unknown>) => void } | null)
    ?.setStyle?.({ symbol: { markerFill: fill, markerWidth: 14, markerHeight: 14 } });
}

function applyBlue() { applyStyle('#2563eb'); }
function applyRed() { applyStyle('#dc2626'); }
function applyGreen() { applyStyle('#16a34a'); }
</script>
