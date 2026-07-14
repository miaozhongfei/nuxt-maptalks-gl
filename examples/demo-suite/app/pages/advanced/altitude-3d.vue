<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">进阶 · 3D 高度</h1>
    <p class="text-muted mb-6">演示相机俯仰角（pitch）、方位角（bearing）和 <code>useMaptalksCamera</code> 双向同步。</p>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <template #header><h2 class="font-semibold">useMaptalksCamera · 双向同步</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="flyTo3D()">飞到 3D 视角</UButton><UButton size="sm" @click="resetView()">复位</UButton><span class="text-sm text-muted">pitch: {{ pitch ?? '-' }}°, bearing: {{ bearing ?? '-' }}°</span></div></template>
      </UCard>

      <UCard>
        <template #header><h2 class="font-semibold">逃生舱 · 原生 animateTo</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height:350px" />
        <template #footer><div class="flex gap-2"><UButton size="sm" @click="animateToView()">动画飞行</UButton><span class="text-sm text-muted">原生 map.animateTo()</span></div></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">逃生舱 · 3D 建筑（Polygon height + GroupGLLayer）</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:380px" />
        <template #footer><span class="text-sm text-muted">native Marker + altitude 属性 + GroupGLLayer 实现3D高度标记。</span></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { pitch, bearing } = useMaptalksCamera(map1);

function flyTo3D() { toValue(map1)?.animateTo({ pitch: 60, bearing: 45, zoom: 15 }, { duration: 2000 }); }
function resetView() { toValue(map1)?.animateTo({ pitch: 0, bearing: 0, zoom: 13 }, { duration: 1000 }); }

const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
function animateToView() {
  toValue(map2)?.animateTo({ center: [121.5, 31.24], zoom: 15, pitch: 70, bearing: 30 }, { duration: 3000 });
}

// 卡片 3：3D 高度 Marker（逃生舱原生创建，altitude 标记位置高度）
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 15, pitch: 50 });
const { layer: glLayer3 } = useMaptalksGroupGLLayer(map3, {});
useMaptalksTileLayer(map3, { source: 'osm' });
watch(() => toValue(glLayer3), (layer) => {
  if (!layer) return;
  // 中心位置 Marker + 四个角标记 different altitude
  import('maptalks-gl').then(mt => {
    const mk = new mt.Marker([121.4737, 31.2304], { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 16, markerHeight: 16 }, properties: { altitude: 500 } });
    mk.addTo(layer as Parameters<typeof mk.addTo>[0]);
    const mk2 = new mt.Marker([121.474, 31.231], { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 12, markerHeight: 12 }, properties: { altitude: 300 } });
    mk2.addTo(layer as Parameters<typeof mk2.addTo>[0]);
    const mk3 = new mt.Marker([121.473, 31.230], { symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 12, markerHeight: 12 }, properties: { altitude: 800 } });
    mk3.addTo(layer as Parameters<typeof mk3.addTo>[0]);
  });
});
</script>
