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
    <!-- 闪烁操作区 -->
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" color="primary" @click="flashIt">闪烁 6 次</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const map = computed(() => mapCmp.value?.map ?? null);
const { layer } = useMaptalksVectorLayer(map);
// 源 Marker
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
});
// 原生 flash(间隔ms, 次数, 回调, 上下文) 闪烁强调
function flashIt() {
  const geo = toValue(geometry) as unknown as { flash?: (interval: number, count: number, cb: () => void, ctx: unknown) => void } | null;
  geo?.flash?.(200, 6, () => {}, null);
}
</script>
