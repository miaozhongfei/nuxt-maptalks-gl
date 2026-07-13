<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 投影</h1>
    <p class="text-muted mb-6">演示 <code>useMaptalksCoordinate</code> 坐标转换与 maptalks projection 逃生舱。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">坐标转换 · containerPoint ↔ coordinate</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">点击地图查看转换结果。屏幕坐标：{{ screenPt }}，经纬度：{{ geoCoord }}</span></template>
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
let nativeLabel: MaptalksLabel | null = null;
watch(() => map2.value, (m) => {
  if (!m) return;
  import('maptalks-gl').then(mt => {
    const proj = m.getProjection();
    if (!proj) return;
    nativeLabel = new mt.Label(
      `投影: ${proj.code.toUpperCase()}`,
      [121.4737, 31.2304],
      { symbol: { textFaceName: 'monospace', textSize: 14, textFill: '#2563eb' } }
    ) as MaptalksLabel;
    nativeLabel.addTo(m);
  });
}, { immediate: true });
</script>
