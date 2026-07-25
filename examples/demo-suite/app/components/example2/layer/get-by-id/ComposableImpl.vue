<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="xs" color="primary" @click="highlightM2">高亮 m2</UButton>
      <UBadge v-if="result" color="green" variant="subtle">{{ result }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);

// 3 个带 id 的 Marker
useMaptalksMarker(layer, {
  coordinates: [121.4887, 31.2453] as [number, number],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 } },
  id: 'm1',
});
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453] as [number, number],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 } },
  id: 'm2',
});
useMaptalksMarker(layer, {
  coordinates: [121.5227, 31.2453] as [number, number],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 14, markerHeight: 14 } },
  id: 'm3',
});

const result = ref('');

function highlightM2() {
  // 窄类型转换：VectorLayer.getId + Geometry.setSymbol
  const vl = toValue(layer) as unknown as { getGeometryById?: (id: string) => unknown } | null;
  const geo = vl?.getGeometryById?.('m2');
  if (geo) {
    (geo as { setSymbol?: (s: Record<string, unknown>) => void }).setSymbol?.({
      markerFill: '#dc2626',
      markerWidth: 22,
      markerHeight: 22,
    });
    result.value = '已高亮 m2';
  } else {
    result.value = '未找到 m2';
  }
}
</script>
