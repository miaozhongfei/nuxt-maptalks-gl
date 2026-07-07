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
        <span class="text-sm text-muted">操作：点击地图弹出信息框，内容实时显示点击坐标+时刻。已点击次数：{{ clickCount1 }}</span>
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
          <h2 class="font-semibold">真正的自定义 UI 信息框（自定义标题栏+关闭按钮）</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 10.6</UBadge>
        </div>
      </template>
      <p class="text-sm text-muted mb-2">
         <code>useMaptalksInfoWindow</code> 的 <code>options</code> 中 <code>{ custom: true }</code>
        禁用 maptalks 默认模板；content 用完整 HTML 自绘标题栏+关闭按钮（关闭按钮用 <code>nextTick</code> + <code>addEventListener</code> 绑真实事件，解决 <code>onclick</code> 在 <code>setContent</code> HTML 中不生效的问题），
        实现<strong>真正的自定义 UI</strong>。
      </p>
      <div ref="el3" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <template #footer>
        <span class="text-sm text-muted">操作：点击 3 个 Marker 分别弹出不同自定义 UI 信息框（带自绘标题栏+「×」关闭按钮，custom:true 完全自定义）。当前开启：{{ iw3Label || '—' }}</span>
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

const clickCount1 = ref(0);
const iw1Content = ref('点击地图试试');

const { show: show1 } = useMaptalksInfoWindow(map1, {
  content: () => iw1Content.value,
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
    clickCount1.value += 1;
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

// ====== 卡片 3：真正的自定义 UI（title 设 '' + content 自己画标题栏 + 关闭按钮） ======
const el3 = ref<HTMLElement | null>(null);
const { map: map3 } = useMaptalks(el3, { center, zoom: 13 });
useMaptalksTileLayer(map3, { source: 'osm' });
const { layer: vec3 } = useMaptalksVectorLayer(map3);

const iw3Label = ref('');
// 3 个 Marker 共用一个 useMaptalksInfoWindow，通过 content 响应式切换模拟"多个独立信息框"
const iw3Content = ref('');

// 传递事件回调：让 close 事件触发时更新状态
const { show: show3, hide: hide3 } = useMaptalksInfoWindow(map3, {
  options: () => ({ title: '', custom: true, autoPan: true }),
  content: () => iw3Content.value,
  events: {
    close: () => { iw3Label.value = ''; },
  },
});

/** 构建完整自定义 UI 的 HTML（无 onclick——改用 InfoWindow 内置关闭按钮 + close 事件） */
function buildCustom(title: string, color: string, coord: [number, number]) {
  return `<div style="min-width:170px;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15)">
    <div style="background:${color};color:#fff;padding:5px 10px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;align-items:center">
      <span>${title}</span>
      <span class="mt-iw-close-btn" style="cursor:pointer;font-size:16px;line-height:1">×</span>
    </div>
    <div style="background:#fff;padding:6px 10px;font-size:12px;color:#374151">
      [${coord[0].toFixed(5)}, ${coord[1].toFixed(5)}]
    </div>
  </div>`;
}

function openCustom(label: string, color: string, coord: [number, number]) {
  iw3Label.value = label;
  iw3Content.value = buildCustom(label, color, coord);
  show3(coord);
  // show() 之后 DOM 已创建，用原生 addEventListener 给关闭按钮绑事件（onclick 在 setContent HTML 中不生效）
  nextTick(() => {
    const btn = document.querySelector('.mt-iw-close-btn') as HTMLElement | null;
    if (btn) btn.addEventListener('click', () => hide3(), { once: true });
  });
}

useMaptalksMarker(vec3, {
  coordinates: [121.47, 31.23],
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 24, markerHeight: 24 },
  events: { click: () => openCustom('东门店 A', '#2563eb', [121.47, 31.23]) },
});
useMaptalksMarker(vec3, {
  coordinates: [121.5, 31.24],
  symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 24, markerHeight: 24 },
  events: { click: () => openCustom('西门店 B', '#dc2626', [121.5, 31.24]) },
});
useMaptalksMarker(vec3, {
  coordinates: [121.52, 31.22],
  symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 24, markerHeight: 24 },
  events: { click: () => openCustom('南门店 C', '#16a34a', [121.52, 31.22]) },
});
</script>
