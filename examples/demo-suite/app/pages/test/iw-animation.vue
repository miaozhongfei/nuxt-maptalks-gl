<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">InfoWindow 动画测试</h1>
    <p class="text-muted mb-6">对比 composable / 组件，带 / 不带 animation options。</p>

    <div class="grid grid-cols-2 gap-4">
      <!-- 卡片 1：composable 无 options -->
      <UCard>
        <template #header><h2 class="font-semibold">composable · 无 options</h2></template>
        <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height: 300px" />
        <template #footer>
          <div class="flex gap-2"><UButton size="sm" color="primary" @click="show1c([121.4737,31.2304])">显示</UButton><UButton size="sm" @click="hide1c()">隐藏</UButton></div>
        </template>
      </UCard>

      <!-- 卡片 2：composable 带 animation -->
      <UCard>
        <template #header><h2 class="font-semibold">composable · animation:'scale'</h2></template>
        <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height: 300px" />
        <template #footer>
          <div class="flex gap-2"><UButton size="sm" color="primary" @click="show2c([121.4737,31.2304])">显示</UButton><UButton size="sm" @click="hide2c()">隐藏</UButton></div>
        </template>
      </UCard>

      <!-- 卡片 3：组件 无 options -->
      <UCard>
        <template #header><h2 class="font-semibold">组件 · 无 options</h2></template>
        <MaptalksMap ref="mapCmp3" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height: 300px">
          <MaptalksTileLayer source="osm" />
          <MaptalksInfoWindow :coordinates="coord3" :visible="vis3"><div style="padding:8px 12px">无 options</div></MaptalksInfoWindow>
        </MaptalksMap>
        <template #footer>
          <div class="flex gap-2"><UButton size="sm" color="primary" @click="show3()">显示</UButton><UButton size="sm" @click="hide3()">隐藏</UButton></div>
        </template>
      </UCard>

      <!-- 卡片 4：组件 带 animation -->
      <UCard>
        <template #header><h2 class="font-semibold">组件 · animation:'scale'</h2></template>
        <MaptalksMap ref="mapCmp4" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height: 300px">
          <MaptalksTileLayer source="osm" />
          <MaptalksInfoWindow :coordinates="coord4" :visible="vis4" :options="{ animation: 'scale' }"><div style="padding:8px 12px">animation: scale</div></MaptalksInfoWindow>
        </MaptalksMap>
        <template #footer>
          <div class="flex gap-2"><UButton size="sm" color="primary" @click="show4()">显示</UButton><UButton size="sm" @click="hide4()">隐藏</UButton></div>
        </template>
      </UCard>

      <!-- 卡片 5：composable · reactive content + 改内容（复现 composables/infowindow 模式） -->
      <UCard>
        <template #header><h2 class="font-semibold">composable · reactive content + 改内容</h2></template>
        <div ref="el5" class="relative rounded border border-default overflow-hidden" style="height: 300px" />
        <template #footer>
          <div class="flex gap-2"><UButton size="sm" color="primary" @click="show5()">显示</UButton><UButton size="sm" color="warning" @click="changeIWC5()">改内容</UButton><UButton size="sm" @click="hide5c()">隐藏</UButton><span class="text-sm text-muted">当前：{{ iw5Content }}</span></div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 卡片 1：composable 无 options
const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 13 });
useMaptalksTileLayer(map1, { source: 'osm' });
const { show: show1c, hide: hide1c } = useMaptalksInfoWindow(map1, { options: { content: '<div style="padding:8px 12px">无 options</div>' } });

// 卡片 2：composable 带 animation
const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { show: show2c, hide: hide2c } = useMaptalksInfoWindow(map2, { options: { animation: 'scale', content: '<div style="padding:8px 12px">animation: scale</div>' } });

// 卡片 3：组件 无 options
const coord3 = ref<[number, number] | null>(null);
const vis3 = ref(false);
const mapCmp3 = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
function show3() { coord3.value = [121.4737, 31.2304]; vis3.value = true; }
function hide3() { vis3.value = false; }

// 卡片 4：组件 带 animation
const coord4 = ref<[number, number] | null>(null);
const vis4 = ref(false);
const mapCmp4 = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
function show4() { coord4.value = [121.4737, 31.2304]; vis4.value = true; }
function hide4() { vis4.value = false; }

// 卡片 5：reactive content + 改内容
const el5 = ref<HTMLElement | null>(null);
const { map: map5 } = useMaptalks(el5, { center, zoom: 13 });
useMaptalksTileLayer(map5, { source: 'osm' });
const iw5Content = ref('点击试试');
const { show: show5c, hide: hide5c } = useMaptalksInfoWindow(map5, { options: { content: () => iw5Content.value } });
function show5() { show5c([121.4737, 31.2304]); }
function changeIWC5() {
  iw5Content.value = `<div style="padding:8px 12px">reactive content<br>${new Date().toLocaleTimeString()}</div>`;
}
</script>
