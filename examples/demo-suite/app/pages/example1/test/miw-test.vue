<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">MarkerInfoWindow 测试</h1>
    <p class="text-muted mb-6">测试 MaptalksMarkerInfoWindow custom slot 内的按钮事件 + 动画</p>

    <div class="grid grid-cols-2 gap-4">
      <!-- 卡片 1：custom slot 带按钮 -->
      <UCard>
        <template #header><h2 class="font-semibold">custom · 按钮测试</h2></template>
        <MaptalksMap ref="mapCmp1" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:350px" baseLayer="osm">
          <MaptalksVectorLayer>
            <MaptalksMarker :coordinates="[121.47,31.23]" :options="{ symbol: {markerType:'ellipse',markerFill:'#2563eb',markerWidth:24,markerHeight:24} }">
              <MaptalksMarkerInfoWindow :options="{ title: '', custom: true }">
                <div style="min-width:160px;border-radius:4px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.12)">
                  <div style="background:#2563eb;color:#fff;padding:4px 10px;font-size:13px;font-weight:600">东门店</div>
                  <div style="background:#fff;padding:4px 8px;display:flex;gap:4px">
                    <button style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px" @click="countA++">👍 {{ countA }}</button>
                    <button style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px" @click="countA=0">重置</button>
                  </div>
                </div>
              </MaptalksMarkerInfoWindow>
            </MaptalksMarker>
            <MaptalksMarker :coordinates="[121.5,31.24]" :options="{ symbol: {markerType:'ellipse',markerFill:'#dc2626',markerWidth:24,markerHeight:24} }">
              <MaptalksMarkerInfoWindow :options="{ title: '', custom: true }">
                <div style="min-width:160px;border-radius:4px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.12)">
                  <div style="background:#dc2626;color:#fff;padding:4px 10px;font-size:13px;font-weight:600">西门店</div>
                  <div style="background:#fff;padding:4px 8px;display:flex;gap:4px">
                    <button style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px" @click="countB++">👍 {{ countB }}</button>
                    <button style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px" @click="countB=0">重置</button>
                  </div>
                </div>
              </MaptalksMarkerInfoWindow>
            </MaptalksMarker>
          </MaptalksVectorLayer>
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">点 Marker 弹出，点按钮计数。</span></template>
      </UCard>

      <!-- 卡片 2：默认 chrome（无 custom） -->
      <UCard>
        <template #header><h2 class="font-semibold">默认 chrome · title 测试</h2></template>
        <MaptalksMap ref="mapCmp2" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height:350px" baseLayer="osm">
          <MaptalksVectorLayer>
            <MaptalksMarker :coordinates="[121.47,31.23]" :options="{ symbol: {markerType:'ellipse',markerFill:'#16a34a',markerWidth:24,markerHeight:24} }">
              <MaptalksMarkerInfoWindow :options="{ title: '南门店', width: 200, height: 120 }">
                <div style="padding:6px 10px;font-size:13px">坐标 [121.47000, 31.23000]</div>
              </MaptalksMarkerInfoWindow>
            </MaptalksMarker>
          </MaptalksVectorLayer>
        </MaptalksMap>
        <template #footer><span class="text-sm text-muted">内置 chrome（标题栏）+ slot 内容。</span></template>
      </UCard>
    </div>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">useMaptalksMarkerInfoWindow（composable）· 原生 DOM 按钮</h2></template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height:350px" />
      <template #footer><span class="text-sm text-muted">composable 直调。点 Marker 弹出，👍计数，关闭按钮。</span></template>
    </UCard>

    <UCard class="mt-4">
      <template #header><h2 class="font-semibold">useMaptalksMarkerInfoWindow · 响应式改内容</h2></template>
      <div ref="el4" class="relative rounded border border-default overflow-hidden" style="height:350px" />
      <template #footer><div class="flex gap-2 items-center"><UButton size="sm" color="primary" @click="changeMIWContent()">改内容</UButton><span class="text-sm text-muted">当前内容：{{ miwContent4 }}</span></div></template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];
const countA = ref(0);
const countB = ref(0);

// 卡片 3：useMaptalksMarkerInfoWindow composable 直调
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
const { layer: vec3 } = useMaptalksVectorLayer(map3);

const countC = ref(0);
const countD = ref(0);

function buildMIWDom(label: string, color: string, coord: [number, number], count: Ref<number>): HTMLElement | string {
  if (typeof document === 'undefined') return '';
  const el = document.createElement('div');
  el.style.minWidth = '160px';
  el.style.borderRadius = '4px';
  el.style.overflow = 'hidden';
  el.style.boxShadow = '0 1px 6px rgba(0,0,0,0.12)';
  el.innerHTML =
    `<div style="background:${color};color:#fff;padding:4px 10px;font-size:13px;font-weight:600">${label}</div>
    <div style="background:#fff;padding:4px 8px;font-size:12px;color:#374151">[${coord[0].toFixed(5)}, ${coord[1].toFixed(5)}]</div>
    <div style="padding:4px 8px;display:flex;gap:4px;background:#fff">
      <button class="miw-like" style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px">👍 0</button>
      <button class="miw-reset" style="background:#e5e7eb;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:13px">重置</button>
    </div>`;
  el.querySelector('.miw-like')?.addEventListener('click', () => {
    count.value++;
    const b = el.querySelector('.miw-like');
    if (b) b.textContent = `👍 ${count.value}`;
  });
  el.querySelector('.miw-reset')?.addEventListener('click', () => {
    count.value = 0;
    const b = el.querySelector('.miw-like');
    if (b) b.textContent = `👍 ${count.value}`;
  });
  return el;
}

const gC = useMaptalksMarker(vec3, {
  coordinates: [121.47, 31.23],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 } },
}).geometry;
useMaptalksMarkerInfoWindow(gC, { options: { title: '', custom: true, content: buildMIWDom('东门店', '#2563eb', [121.47, 31.23], countC) } });

const gD = useMaptalksMarker(vec3, {
  coordinates: [121.5, 31.24],
  options: { symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 } },
}).geometry;
useMaptalksMarkerInfoWindow(gD, { options: { title: '', custom: true, content: buildMIWDom('西门店', '#dc2626', [121.5, 31.24], countD) } });

// 卡片 4：响应式改内容
const el4 = ref<HTMLElement | null>(null);
const { map: map4 } = useMaptalks(el4, { center, zoom: 13 });
useMaptalksTileLayer(map4, { source: 'osm' });
const { layer: vec4 } = useMaptalksVectorLayer(map4);
const miwContent4 = ref('初始内容');
const gE = useMaptalksMarker(vec4, {
  coordinates: [121.47, 31.23],
  options: { symbol: { markerType: 'ellipse', markerFill: '#8b5cf6', markerWidth: 24, markerHeight: 24 } },
}).geometry;
useMaptalksMarkerInfoWindow(gE, { options: () => ({ title: '', custom: true, content: miwContent4.value }) });
function changeMIWContent() {
  miwContent4.value = `<div style="padding:10px;min-width:140px;text-align:center">
    <strong style="color:#8b5cf6">改内容测试</strong>
    <p style="font-size:12px;color:#6b7280;margin:4px 0">${new Date().toLocaleTimeString()}</p>
  </div>`;
}
</script>
