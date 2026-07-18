<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 编辑·拖拽</h1>
    <p class="text-muted mb-6">演示 <code>useMaptalksDrawTool</code> 绘制图形与逃生舱几何编辑。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">DrawTool · 绘制模式</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" :color="btnMode==='Point'?'primary':'neutral'" @click="setMode('Point')">点</UButton><UButton size="sm" :color="btnMode==='LineString'?'primary':'neutral'" @click="setMode('LineString')">线</UButton><UButton size="sm" :color="btnMode==='Polygon'?'primary':'neutral'" @click="setMode('Polygon')">面</UButton><UButton size="sm" color="error" @click="setMode(null)">停用</UButton><span class="text-sm text-muted ml-2">绘制结果持久保存</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生编辑</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" color="primary" @click="toggleEdit()">切换编辑模式</UButton><span class="text-sm text-muted">原生 geometry.startEdit() / endEdit()</span></div></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">逃生舱 · Marker 拖拽</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><span class="text-sm text-muted">原生 new Marker({ draggable: true }) 构造器参数实现拖拽。</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { layer: drawVec } = useMaptalksVectorLayer(map1);

const { enabled, mode, setMode: dtSetMode, result } = useMaptalksDrawTool(map1, { once: false });
const btnMode = ref<string | null>(null);
function setMode(m: string | null) {
  btnMode.value = m;
  if (m) { dtSetMode(m); enabled.value = true; }
  else enabled.value = false;
}

// 绘制完成后把图形加入 VectorLayer 持久保存
watch(result, (ev) => {
  if (!ev) return;
  // drawend 事件的 ev 就是 maptalks geometry 本身，不是包含 .geometry 属性的 wrapper
  const geo = (ev as { copy?: () => unknown })?.copy?.();
  const layer = toValue(drawVec);
  if (geo && layer) (layer as Record<string, (...args: unknown[]) => unknown>).addGeometry?.(geo);
});

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

// 卡片 3：draggable Marker（逃生舱原生创建，draggable 是构造器参数）
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
const { layer: dragVec } = useMaptalksVectorLayer(map3);
watch(() => toValue(dragVec), (layer) => {
  if (!layer) return;
  import('maptalks-gl').then(mt => {
    const mk = new mt.Marker([121.47, 31.23], {
      symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 },
      draggable: true,
    });
    mk.addTo(layer as Parameters<typeof mk.addTo>[0]);
  });
});
</script>
