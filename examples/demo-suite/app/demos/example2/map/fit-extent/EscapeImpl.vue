<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex gap-2 mt-3">
      <UButton size="sm" @click="fit">原生 map.fitExtent</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [-0.113049, 51.498568], zoom: 11 });
useMaptalksTileLayer(map, { source: 'osm' });

// 逃生舱：工厂 new 原生 VectorLayer + Polygon，保存 poly 引用
let poly: { getExtent: () => unknown } | null = null;
useMaptalksLayer(map, (mt) => {
  const layer = new mt.VectorLayer('fit-v');
  const p = new mt.Polygon(
    [[[-0.13, 51.5], [-0.1, 51.5], [-0.1, 51.51], [-0.13, 51.51], [-0.13, 51.5]]],
    { symbol: { polygonFill: '#dc2626', polygonOpacity: 0.3, lineColor: '#b91c1c', lineWidth: 2 } },
  );
  layer.addGeometry(p);
  poly = p as unknown as { getExtent: () => unknown };
  return layer;
});

// 原生 fitExtent 直调
function fit() {
  const m = map.value as unknown as { fitExtent: (e: unknown, z?: number) => void } | null;
  if (m && poly) m.fitExtent(poly.getExtent(), 0);
}
</script>
