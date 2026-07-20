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
    <!-- 克隆操作区 -->
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" color="primary" @click="cloneOne">克隆一个</UButton>
      <span class="text-sm text-muted">已克隆 {{ count }} 个</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// 源 Marker（蓝色点，原地不动）
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.497, 31.242],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
});
const count = ref(0);
// geometry.copy() 克隆几何并加回图层
function cloneOne() {
  const geo = toValue(geometry) as unknown as { copy?: () => { setCoordinates?: (c: [number, number]) => void; setSymbol?: (s: Record<string, unknown>) => void; addTo?: (l: unknown) => void } } | null;
  const l = toValue(layer);
  if (!geo?.copy || !l) return;
  count.value += 1;
  // copy() 返回不带事件的新几何，需手动改坐标并加回图层
  const cloned = geo.copy();
  cloned.setCoordinates?.([121.497 + count.value * 0.004, 31.242 + count.value * 0.002]);
  cloned.setSymbol?.({ markerType: 'ellipse', markerFill: count.value % 2 === 0 ? '#f59e0b' : '#8b5cf6', markerWidth: 18, markerHeight: 18 });
  cloned.addTo?.(l);
}
</script>
