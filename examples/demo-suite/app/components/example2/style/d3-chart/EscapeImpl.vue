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
// 内联 SVG 饼图作为 UIMarker 内容
const svgPieChart = '<svg width="60" height="60">'
  + '<circle r="25" cx="30" cy="30" fill="#2563eb"/>'
  + '<path d="M30,30 L30,5 A25,25 0 0,1 50,18 Z" fill="#dc2626"/>'
  + '</svg>';
let uiMarker: { remove: () => void } | null = null;
watch(() => toValue(map), (m) => {
  if (!m) return;
  import('maptalks-gl').then((mt) => {
    uiMarker = new (mt as any).ui.UIMarker([121.5057, 31.2453], {
      content: `<div style="text-align:center">${svgPieChart}<div style="font-size:11px;color:#374151;margin-top:2px">D3 风格饼图</div></div>`,
    });
    uiMarker!.addTo(m);
  });
});
onBeforeUnmount(() => {
  uiMarker?.remove();
});
</script>
