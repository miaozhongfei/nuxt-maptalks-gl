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
</script>
