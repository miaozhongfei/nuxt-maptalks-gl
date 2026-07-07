<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 信息框</h1>
    <p class="text-muted mb-6">
      演示 <code>useMaptalksInfoWindow</code> 的多种用法：地图点击弹框、Marker 点击弹框、实时更新内容、自定义 UI（HTML 字符串）、事件回调。
    </p>

    <!-- 卡片 1：地图点击 + 实时内容 + 事件 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">地图点击弹框 + 实时内容 + open/close 事件</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.4</UBadge>
        </div>
      </template>
      <div ref="el1" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <span class="text-sm text-muted">操作：点击地图弹出信息框，内容实时显示点击坐标+时刻。footer 显示事件日志：{{ eventLog || '（无事件）' }}</span>
      </template>
    </UCard>

    <!-- 卡片 2：Marker 点击弹框 + 命令式内容更新 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">Marker 点击 · 动态内容 · show/hide 命令式</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.5 / 10.10</UBadge>
        </div>
      </template>
      <div ref="el2" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <span class="text-sm text-muted">操作：点击两个 Marker 切换信息框内容、切到第三个 Marker 主动隐藏。每次点 Marker 自动更新内容（当前标注：{{ mk2Label }}）。</span>
      </template>
    </UCard>

    <!-- 卡片 3：marker.setInfoWindow() 原生模式 —— 每个 Marker 有自己独立的、自定义 UI 的信息框 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">marker.setInfoWindow() · 每个 Marker 独立信息框 · 自定义 UI</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.5</UBadge>
        </div>
      </template>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <span class="text-sm text-muted">操作：点击 3 个 Marker 分别弹出各自独立的信息框（蓝色=店 A、红色=店 B、绿色=店 C），含自定义 HTML 内容和样式。</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// ====== 卡片 1：地图点击 + 实时内容 + 事件 ======
const el1 = ref<HTMLElement | null>(null);
const { map: map1 } = useMaptalks(el1, { center, zoom: 12 });
useMaptalksTileLayer(map1, { source: 'osm' });

const eventLog = ref('');
const iw1Content = ref('点击地图试试');

const { show: show1, hide: hide1 } = useMaptalksInfoWindow(map1, {
  content: () => iw1Content.value,
  events: {
    open: () => { eventLog.value = 'open 事件触发'; },
    close: () => { eventLog.value = 'close 事件触发'; },
  },
});

useMaptalksEvents(map1, {
  click: (e: unknown) => {
    const ev = e as { coordinate: { x: number; y: number } };
    const t = new Date().toLocaleTimeString();
    iw1Content.value =
      `<div style="padding:6px 10px;min-width:180px">
        <strong style="color:#2563eb">地图点击信息框</strong>
        <p style="margin:2px 0;font-size:13px">经度：${ev.coordinate.x.toFixed(6)}</p>
        <p style="margin:2px 0;font-size:13px">纬度：${ev.coordinate.y.toFixed(6)}</p>
        <p style="color:#6b7280;font-size:12px;margin:2px 0">时刻：${t}</p>
      </div>`;
    show1([ev.coordinate.x, ev.coordinate.y]);
  },
});

// ====== 卡片 2：Marker 点击 + 动态内容切换 + show/hide ======
const el2 = ref<HTMLElement | null>(null);
const { map: map2 } = useMaptalks(el2, { center, zoom: 13 });
useMaptalksTileLayer(map2, { source: 'osm' });
const { layer: vec2 } = useMaptalksVectorLayer(map2);

const mk2Label = ref('—');
const mk2Content = ref('点击一个 Marker');

const { show: show2, hide: hide2 } = useMaptalksInfoWindow(map2, {
  content: () => mk2Content.value,
});

function openMK(label: string, coord: [number, number], color: string) {
  mk2Label.value = label;
  const t = new Date().toLocaleTimeString();
  mk2Content.value =
    `<div style="padding:6px 10px;min-width:160px">
      <strong style="color:${color}">Marker 「${label}」信息框</strong>
      <p style="margin:2px 0;font-size:13px">[${coord[0].toFixed(5)}, ${coord[1].toFixed(5)}]</p>
      <p style="color:#6b7280;font-size:12px;margin:2px 0">${t}</p>
    </div>`;
  show2(coord);
}

// 蓝 Marker
useMaptalksMarker(vec2, {
  coordinates: [121.47, 31.23],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 22, markerHeight: 22 },
  events: { click: () => openMK('甲', [121.47, 31.23], '#2563eb') },
});
// 红 Marker
useMaptalksMarker(vec2, {
  coordinates: [121.5, 31.24],
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 22, markerHeight: 22 },
  events: { click: () => openMK('乙', [121.5, 31.24], '#dc2626') },
});
// 灰 Marker——点击关闭信息框
useMaptalksMarker(vec2, {
  coordinates: [121.51, 31.22],
  symbol: { markerType: 'ellipse', markerFill: '#6b7280', markerWidth: 22, markerHeight: 22 },
  events: { click: () => { mk2Label.value = '—'; hide2(); } },
});

// ====== 卡片 3：marker.setInfoWindow() 原生模式 ======
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
const { layer: vec3 } = useMaptalksVectorLayer(map3);

// maptalks 原生的 Marker 接口（geometry 即原生 Marker 实例，有 setInfoWindow/openInfoWindow/closeInfoWindow）
interface NativeMarker {
  setInfoWindow(opts: { title: string; content: string; width?: number; height?: number; autoPan?: boolean }): void;
  openInfoWindow(): void;
  closeInfoWindow(): void;
}

/** 给一个 Marker 配置独立的信息框（每个 Marker 自己的，带自定义 HTML 内容和样式） */
function setupMarkerIW(geo: ReturnType<typeof useMaptalksMarker>['geometry'], title: string, label: string, color: string) {
  watch(geo, (g) => {
    if (!g) return;
    const m = g as unknown as NativeMarker;
    m.setInfoWindow({
      title,
      content:
        `<div style="padding:6px 10px;min-width:150px;font-size:13px">
          <strong style="color:${color}">${label}</strong>
          <p style="font-size:12px;color:#374151;margin:4px 0 0">这是 marker.setInfoWindow() 创建的本 Marker 独立信息框。</p>
          <p style="font-size:11px;color:#9ca3af;margin:2px 0 0">maptalks 原生 API，每个 Marker 可独立配置。</p>
        </div>`,
    });
    // 点击直接打开本 Marker 的信息框（不再用坐标操控全局 InfoWindow）
    g.on('click', () => m.openInfoWindow());
  });
}

const { geometry: gA } = useMaptalksMarker(vec3, {
  coordinates: [121.47, 31.23],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 },
});
setupMarkerIW(gA, '店 A', '东门店 A', '#2563eb');

const { geometry: gB } = useMaptalksMarker(vec3, {
  coordinates: [121.5, 31.24],
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 },
});
setupMarkerIW(gB, '店 B', '西门店 B', '#dc2626');

const { geometry: gC } = useMaptalksMarker(vec3, {
  coordinates: [121.52, 31.22],
  symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 24, markerHeight: 24 },
});
setupMarkerIW(gC, '店 C', '南门店 C', '#16a34a');
</script>
