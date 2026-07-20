<template>
  <div
    ref="el"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  />
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });
// 内联 SVG 柱状图
const svgBarChart = '<svg width="80" height="60">'
  + '<rect x="5" y="20" width="15" height="35" fill="#2563eb"/>'
  + '<rect x="25" y="10" width="15" height="45" fill="#dc2626"/>'
  + '<rect x="45" y="30" width="15" height="25" fill="#f59e0b"/>'
  + '</svg>';
let uiMarker: { remove: () => void } | null = null;
watch(() => toValue(map), (m) => {
  if (!m) return;
  import('maptalks-gl').then((mt) => {
    uiMarker = new (mt as any).ui.UIMarker([121.5057, 31.2453], {
      content: `<div style="text-align:center">${svgBarChart}<div style="font-size:11px;color:#374151;margin-top:2px">ECharts 风格柱状图</div></div>`,
    });
    uiMarker!.addTo(m);
  });
});
onBeforeUnmount(() => {
  uiMarker?.remove();
});
</script>
