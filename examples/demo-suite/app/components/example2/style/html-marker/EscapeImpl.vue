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
// 使用原生 ui.UIMarker 将 HTML 内容锚定到地图坐标
let uiMarker: { remove: () => void } | null = null;
watch(() => toValue(map), (m) => {
  if (!m) return;
  import('maptalks-gl').then((mt) => {
    uiMarker = new (mt as any).ui.UIMarker([121.5057, 31.2453], {
      content: '<div style="background:#2563eb;color:white;padding:6px 12px;border-radius:6px;font-size:13px">HTML Marker 陆家嘴</div>',
    });
    uiMarker!.addTo(m);
  });
});
onBeforeUnmount(() => {
  uiMarker?.remove();
});
</script>
