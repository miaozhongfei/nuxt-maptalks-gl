<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 编辑·拖拽</h1>
    <p class="text-muted mb-6">演示 <code>useMaptalksDrawTool</code> 绘制图形与逃生舱几何编辑。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">DrawTool · 绘制模式</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" :color="mode==='point'?'primary':'neutral'" @click="setMode('point')">点</UButton><UButton size="sm" :color="mode==='line'?'primary':'neutral'" @click="setMode('line')">线</UButton><UButton size="sm" :color="mode==='polygon'?'primary':'neutral'" @click="setMode('polygon')">面</UButton><UButton size="sm" color="error" @click="setMode(null)">停用</UButton></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生编辑</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="toggleEdit()">切换编辑模式</UButton><span class="text-sm text-muted">原生 geometry.startEdit() / endEdit()</span></div></template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { layer: drawVec } = useMaptalksVectorLayer(map1);

const mode = ref<string | null>(null);
const { enabled } = useMaptalksDrawTool(map1, { enabled: computed(() => !!mode.value), mode, once: false });
watch(mode, (v) => { enabled.value = !!v; });

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { layer: editVec } = useMaptalksVectorLayer(map2);
const { geometry: editGeo } = useMaptalksPolygon(editVec, {
  coordinates: [[121.47, 31.23], [121.49, 31.23], [121.49, 31.25], [121.47, 31.25]],
  symbol: { lineWidth: 2, lineColor: '#2563eb', polygonFill: '#2563eb', polygonOpacity: 0.2 },
});
let editing = false;
function toggleEdit() {
  editing = !editing;
  const geo = toValue(editGeo) as { startEdit?: () => void; endEdit?: () => void } | null;
  if (editing) geo?.startEdit?.();
  else geo?.endEdit?.();
}
</script>
