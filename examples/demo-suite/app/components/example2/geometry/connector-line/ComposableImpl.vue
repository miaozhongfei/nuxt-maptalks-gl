<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const SOURCE: [number, number] = [121.49, 31.24];
const TARGET: [number, number] = [121.52, 31.252];

const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' });
const { layer } = useMaptalksVectorLayer(map);
const { geometry: source } = useMaptalksMarker(layer, {
  coordinates: SOURCE,
  options: {
    symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
  },
});
const { geometry: target } = useMaptalksMarker(layer, {
  coordinates: TARGET,
  options: {
    symbol: { markerType: 'ellipse', markerFill: '#22c55e', markerWidth: 18, markerHeight: 18 },
  },
});

// 无 preset 的 ConnectorLine/ArcConnectorLine：等 layer + marker 就绪后动态导入原生构造器
let connectorsAdded = false;
watch(
  [layer, source, target],
  async ([l, s, t]) => {
    if (!l || !s || !t || connectorsAdded) return;
    connectorsAdded = true;
    const mt = await import('maptalks-gl');
    // 原生 ConnectorLine 返回类型与模块 MaptalksGeometry 结构性不兼容（addTo 参数为原生 OverlayLayer），逃生舱断言
    const line = new mt.ConnectorLine(s as any, t as any, {
      showOn: 'always',
      symbol: { lineColor: '#dc2626', lineWidth: 3 },
    }) as unknown as MaptalksGeometry;
    const arc = new mt.ArcConnectorLine(s as any, t as any, {
      showOn: 'always',
      arcDegree: 60,
      symbol: { lineColor: '#7c3aed', lineWidth: 2 },
    }) as unknown as MaptalksGeometry;
    // 此时 layer 已在 map 上，getMap() 可用，_updateCoordinates() 正常计算路径（addGeometry 支持多参）
    l.addGeometry(line, arc);
  },
  { immediate: true },
);
</script>
