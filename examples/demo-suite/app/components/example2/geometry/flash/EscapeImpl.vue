<template>
  <div>
    <div
      ref="el"
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
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
// 逃生舱：底图也用模块托管（osm 命名源），保持与其他 tab 视觉统一
useMaptalksTileLayer(map, { source: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
// 源 Marker（工厂模式——逃生舱口径：直接 new 原生几何）
const { geometry } = useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
}));
// 原生 flash(间隔ms, 次数, 回调, 上下文) 闪烁强调
function flashIt() {
  const geo = toValue(geometry) as unknown as { flash?: (interval: number, count: number, cb: () => void, ctx: unknown) => void } | null;
  geo?.flash?.(200, 6, () => {}, null);
}
</script>
