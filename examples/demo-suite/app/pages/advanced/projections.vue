<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 投影</h1>
    <p class="text-muted mb-6">演示 <code>useMaptalksCoordinate</code> 坐标转换与 maptalks projection 逃生舱。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">坐标转换 · containerPoint ↔ coordinate</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">移动鼠标查看实时转换。屏幕坐标：{{ screenPt }}，经纬度：{{ geoCoord }}</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · native projection API</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 <code>map.getProjection()</code> / <code>coordinateToContainerPoint</code> 等。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { containerPointToCoordinate } = useMaptalksCoordinate(map1);

const screenPt = ref('');
const geoCoord = ref('');

useMaptalksEvents(map1, {
  mousemove: (e: unknown) => {
    const ev = e as { coordinate: { x: number; y: number }; containerPoint: { x: number; y: number } };
    screenPt.value = `(${ev.containerPoint.x.toFixed(0)}, ${ev.containerPoint.y.toFixed(0)})`;
    geoCoord.value = `[${ev.coordinate.x.toFixed(5)}, ${ev.coordinate.y.toFixed(5)}]`;
  },
});

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { layer: projVec } = useMaptalksVectorLayer(map2);
useMaptalksLabel(projVec, {
  content: () => {
    const m = toValue(map2);
    if (!m) return '加载中…';
    const proj = m.getProjection();
    return `投影: ${proj.code.toUpperCase()}`;
  },
  coordinates: [121.4737, 31.2304],
  symbol: { textFaceName: 'monospace', textSize: 14, textFill: '#2563eb', textHaloFill: '#fff', textHaloRadius: 2 },
});
</script>
