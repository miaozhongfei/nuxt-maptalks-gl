<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · UI 组件</h1>
    <p class="text-muted mb-6">演示自定义 InfoWindow 样式和逃生舱原生 UIComponent。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">自定义样式 InfoWindow</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="showCustomIW()">显示</UButton><span class="text-sm text-muted">useMaptalksInfoWindow + 自定义 HTML</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生 UIComponent</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 new UIComponent() / ui.InfoWindow。</span></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { show: show1 } = useMaptalksInfoWindow(map1, {
  options: { title: '自定义样式', content: '<div style="padding:10px;border-left:4px solid #2563eb;background:#f0f4ff">自定义 HTML 内容</div>' },
});
function showCustomIW() { show1([121.4737, 31.2304]); }

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { layer: vec2 } = useMaptalksVectorLayer(map2);
const { geometry: mk2 } = useMaptalksMarker(vec2, {
  coordinates: [121.47, 31.23],
  symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 24, markerHeight: 24 },
});
onMounted(() => {
  const geo = toValue(mk2);
  if (!geo) return;
  const maptalksGL = (geo as Record<string, unknown>).constructor as { setInfoWindow?: (opts: Record<string, unknown>) => void };
  maptalksGL?.setInfoWindow?.({ title: '原生 UIComponent', content: '<div style="padding:8px">marker.setInfoWindow 原生弹出</div>' });
});
</script>
