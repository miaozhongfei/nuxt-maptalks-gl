<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 信息框</h1>
    <p class="text-muted mb-6">
      演示 <code>MaptalksInfoWindow</code>（地图级）与 <code>useMaptalksMarkerInfoWindow</code>（标记级，每个 Marker 独立信息框 + 自定义 UI）。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">地图点击弹框 + 坐标实时更新</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.4</UBadge>
        </div>
      </template>
      <MaptalksMap ref="mapCmp1" :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 380px">
        <MaptalksTileLayer source="osm" />
        <MaptalksInfoWindow :coordinates="iwCoord" :visible="showIW">
          <div class="iw-content"><strong>地图点击信息框</strong><p>经度：{{ iwCoord[0].toFixed(6) }}</p><p>纬度：{{ iwCoord[1].toFixed(6) }}</p><p class="iw-time">点击时刻：{{ iwTime }}</p></div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer><span class="text-sm text-muted">操作：点击地图任意位置，信息框弹出并显示坐标+点击时刻（实时更新）。</span></template>
    </UCard>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">Marker 上的信息框 · 自定义 UI · 点击事件</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.5</UBadge>
        </div>
      </template>
      <MaptalksMap ref="mapCmp2" :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height: 380px">
        <MaptalksTileLayer source="osm" />
        <MaptalksVectorLayer>
          <MaptalksMarker :coordinates="[121.47, 31.23]" :symbol="{ markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 22, markerHeight: 22 }" @click="onMarkerClick('A', [121.47, 31.23])" />
          <MaptalksMarker :coordinates="[121.5, 31.24]" :symbol="{ markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 22, markerHeight: 22 }" @click="onMarkerClick('B', [121.5, 31.24])" />
        </MaptalksVectorLayer>
        <MaptalksInfoWindow :coordinates="mkCoord" :visible="showMK">
          <div class="iw-content" style="min-width: 180px"><strong>Marker {{ mkLabel }} 信息框</strong><p>位置：[{{ mkCoord[0].toFixed(5) }}, {{ mkCoord[1].toFixed(5) }}]</p><p class="iw-time">点击时间：{{ mkTime }}</p><div style="margin-top:4px;display:flex;gap:4px"><button class="iw-btn" @click="mkCount+=1">👍 {{ mkCount }}</button><button class="iw-btn" @click="closeMK">关闭</button></div></div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer><span class="text-sm text-muted">操作：点击蓝色/红色 Marker 打开不同的信息框，内含可交互按钮。</span></template>
    </UCard>

    <!-- 卡片 3：每个 Marker 独立信息框（composable 模式，同 composable 页卡片 3） -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksMarkerInfoWindow · 每个 Marker 独立信息框 · 自定义 UI</h2>
          <UBadge color="primary" variant="subtle">组件+composable 混合</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.5</UBadge>
        </div>
      </template>
      <p class="text-sm text-muted mb-2">地图用 <code>&lt;MaptalksMap&gt;</code> + <code>&lt;MaptalksVectorLayer&gt;</code> 声明式创建；Marker 和 InfoWindow 用 <code>useMaptalksMarker</code> + <code>useMaptalksMarkerInfoWindow</code> composable 纳管。点击 Marker 弹出独立信息框，点「×」关闭。</p>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <div class="flex gap-2 items-center flex-wrap">
          <UButton size="sm" :color="autoClose ? 'success' : 'neutral'" variant="soft" @click="autoClose = !autoClose">点别处自动关闭：{{ autoClose ? '开' : '关' }}</UButton>
          <span class="text-sm text-muted">当前开启：{{ iw3Label || '—' }}</span>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { toValue } from 'vue';

const center: [number, number] = [121.4737, 31.2304];

// 卡片 1
const iwCoord = ref<[number, number]>([121.4737, 31.2304]); const showIW = ref(false); const iwTime = ref('');
const mapCmp1 = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null); const map1 = computed(() => mapCmp1.value?.map ?? null);
useMaptalksEvents(map1, { click: (e: unknown) => { const ev = e as { coordinate: { x: number; y: number } }; iwCoord.value = [ev.coordinate.x, ev.coordinate.y]; iwTime.value = new Date().toLocaleTimeString(); showIW.value = true; } });

// 卡片 2
const mkCoord = ref<[number, number]>([121.47, 31.23]); const mkLabel = ref('A'); const mkTime = ref(''); const mkCount = ref(0); const showMK = ref(false);
function onMarkerClick(label: string, coord: [number, number]) { mkLabel.value = label; mkCoord.value = coord; mkTime.value = new Date().toLocaleTimeString(); mkCount.value = 0; showMK.value = true; }
function closeMK() { showMK.value = false; }

// 卡片 3：useMaptalksMarkerInfoWindow（同 composable 页卡片 3 模式）
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
const { layer: vec3 } = useMaptalksVectorLayer(map3);
const iw3Label = ref('');
interface NativeMarker { openInfoWindow(): void; closeInfoWindow(): void; }
let mkOpenTime = 0; let curOpen: NativeMarker | null = null;
const autoClose = ref(true);

function mkContent(title: string, color: string, coord: [number, number]): string {
  return `<div style="min-width:160px;border-radius:4px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,0.12)">
    <div style="background:${color};color:#fff;padding:4px 10px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;align-items:center">
      <span>${title}</span><span class="mt-miw-close" style="cursor:pointer;font-size:16px;line-height:1">×</span>
    </div><div style="background:#fff;padding:5px 10px;font-size:12px;color:#374151">[${coord[0].toFixed(5)}, ${coord[1].toFixed(5)}]</div></div>`;
}

function bindCloseBtn(g: typeof gA) {
  setTimeout(() => {
    const btn = document.querySelector('.mt-miw-close') as HTMLElement | null;
    if (btn) btn.addEventListener('click', () => { (toValue(g) as unknown as NativeMarker)?.closeInfoWindow(); iw3Label.value = ''; curOpen = null; }, { once: true });
  }, 50);
}

useMaptalksEvents(map3, { click: () => { if (!autoClose.value || Date.now() - mkOpenTime < 250) return; curOpen?.closeInfoWindow(); iw3Label.value = ''; curOpen = null; } });

const gA = useMaptalksMarker(vec3, { coordinates: [121.47, 31.23], symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 } }).geometry;
useMaptalksMarkerInfoWindow(gA, { title: '', custom: true, content: mkContent('东门店 A', '#2563eb', [121.47, 31.23]) });
useMaptalksEvents(gA as unknown as Parameters<typeof useMaptalksEvents>[0], { click: () => { curOpen = toValue(gA) as unknown as NativeMarker; mkOpenTime = Date.now(); curOpen?.openInfoWindow(); iw3Label.value = '东门店 A'; bindCloseBtn(gA); } });

const gB = useMaptalksMarker(vec3, { coordinates: [121.5, 31.24], symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 } }).geometry;
useMaptalksMarkerInfoWindow(gB, { title: '', custom: true, content: mkContent('西门店 B', '#dc2626', [121.5, 31.24]) });
useMaptalksEvents(gB as unknown as Parameters<typeof useMaptalksEvents>[0], { click: () => { curOpen = toValue(gB) as unknown as NativeMarker; mkOpenTime = Date.now(); curOpen?.openInfoWindow(); iw3Label.value = '西门店 B'; bindCloseBtn(gB); } });

const gC = useMaptalksMarker(vec3, { coordinates: [121.52, 31.22], symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 24, markerHeight: 24 } }).geometry;
useMaptalksMarkerInfoWindow(gC, { title: '', custom: true, content: mkContent('南门店 C', '#16a34a', [121.52, 31.22]) });
useMaptalksEvents(gC as unknown as Parameters<typeof useMaptalksEvents>[0], { click: () => { curOpen = toValue(gC) as unknown as NativeMarker; mkOpenTime = Date.now(); curOpen?.openInfoWindow(); iw3Label.value = '南门店 C'; bindCloseBtn(gC); } });
</script>

<style scoped>
.iw-content { padding: 6px 10px; font-size: 13px; } .iw-content strong { color: #2563eb; } .iw-content p { margin: 2px 0; } .iw-time { color: #6b7280; font-size: 12px; } .iw-btn { padding: 2px 8px; border: 1px solid #d1d5db; border-radius: 4px; background: #fff; cursor: pointer; font-size: 12px; } .iw-btn:hover { background: #f3f4f6; }
</style>
