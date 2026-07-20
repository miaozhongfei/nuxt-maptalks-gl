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
// 内联 SVG 折线图
const svgLineChart = '<svg width="80" height="60">'
  + '<polyline points="5,50 25,30 45,40 65,10 75,15" fill="none" stroke="#dc2626" stroke-width="2"/>'
  + '<circle cx="5" cy="50" r="3" fill="#2563eb"/>'
  + '<circle cx="25" cy="30" r="3" fill="#2563eb"/>'
  + '<circle cx="45" cy="40" r="3" fill="#2563eb"/>'
  + '<circle cx="65" cy="10" r="3" fill="#2563eb"/>'
  + '<circle cx="75" cy="15" r="3" fill="#2563eb"/>'
  + '</svg>';
let uiMarker: { remove: () => void } | null = null;
watch(() => toValue(map), (m) => {
  if (!m) return;
  import('maptalks-gl').then((mt) => {
    uiMarker = new (mt as any).ui.UIMarker([121.5057, 31.2453], {
      content: `<div style="text-align:center">${svgLineChart}<div style="font-size:11px;color:#374151;margin-top:2px">Highcharts 风格折线图</div></div>`,
    });
    uiMarker!.addTo(m);
  });
});
onBeforeUnmount(() => {
  uiMarker?.remove();
});
</script>
