<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 曲线·连接线</h1>
    <p class="text-muted mb-6">演示曲线路径（ArcCurve）和连接线（ConnectorLine）逃生舱。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · ArcCurve 曲线</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 new ArcCurve()。</span></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · ConnectorLine 连接线</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 new ConnectorLine()。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { layer: vec1 } = useMaptalksVectorLayer(map1);
watch(() => toValue(vec1), (layer) => {
  if (!layer) return;
  import('maptalks-gl').then(mt => {
    const arc = new mt.ArcCurve([[121.47, 31.23], [121.51, 31.25]], {
      symbol: { lineColor: '#2563eb', lineWidth: 3, arcDegree: 90 },
    });
    arc.addTo(layer);
  });
}, { immediate: true });

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { layer: vec2 } = useMaptalksVectorLayer(map2);
watch(() => toValue(vec2), (layer) => {
  if (!layer) return;
  import('maptalks-gl').then(mt => {
    const line = new mt.ConnectorLine(
      new mt.Coordinate(121.47, 31.23),
      new mt.Coordinate(121.51, 31.25),
      { symbol: { lineColor: '#dc2626', lineWidth: 2, lineDasharray: [8, 4] }, connectorType: 'arc' },
    );
    line.addTo(layer);
  });
}, { immediate: true });
</script>
