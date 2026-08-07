<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Composable 单独示例 · 相机 · 事件 · 坐标</h1>
    <p class="text-muted mb-6">
      演示横切类 composable：地图事件绑定、相机双向同步与过渡、坐标转换、绘制工具、GeoJSON 加载、通用几何原语。
    </p>

    <!-- Events + Camera + Coordinate：同一张地图上组合演示 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksEvents + useMaptalksCamera + useMaptalksCoordinate</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 1.4~1.14 / 9.1</UBadge>
        </div>
      </template>
      <div ref="elMain" class="relative rounded border border-default overflow-hidden" style="height: 320px" />
      <template #footer>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-muted">
            相机：center=[{{ fmt(cam.center.value?.x) }}, {{ fmt(cam.center.value?.y) }}]
            zoom={{ cam.zoom.value?.toFixed(2) }} pitch={{ cam.pitch.value?.toFixed(0) }}
          </div>
          <div class="text-sm text-muted">最近点击：{{ lastClick }}</div>
          <div class="text-sm text-muted">中心点转屏幕像素：{{ centerPixel }}</div>
          <div class="flex gap-2 flex-wrap">
            <UButton size="sm" @click="flyToLujiazui">animateTo 陆家嘴</UButton>
            <UButton size="sm" color="neutral" @click="cam.panBy([120, 0])">panBy 右移</UButton>
            <UButton size="sm" color="neutral" @click="convertCenter">转换中心点为像素</UButton>
          </div>
        </div>
      </template>
    </UCard>

    <!-- DrawTool -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksDrawTool</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 8.5</UBadge>
        </div>
      </template>
      <p class="text-sm text-muted mb-2">
        交互式绘制工具：先点「启用」，选点/线/面模式，然后在地图上单击绘制、双击结束。
        DrawTool 只负责“画”，画完默认会清除临时图形；本示例监听 <code>result</code> 把画好的图形保留到一个矢量图层。
      </p>
      <div ref="elDraw" class="relative rounded border border-default overflow-hidden" style="height: 320px" />
      <template #footer>
        <div class="flex gap-2 flex-wrap items-center">
          <UButton size="sm" @click="draw.enable()">启用</UButton>
          <UButton size="sm" color="neutral" @click="draw.disable()">停用</UButton>
          <UButton size="sm" color="neutral" @click="draw.setMode('Point')">点</UButton>
          <UButton size="sm" color="neutral" @click="draw.setMode('LineString')">线</UButton>
          <UButton size="sm" color="neutral" @click="draw.setMode('Polygon')">面</UButton>
          <UButton size="sm" color="error" variant="soft" @click="clearDrawn">清空</UButton>
          <span class="text-sm text-muted">模式：{{ draw.mode.value }}，启用：{{ draw.enabled.value }}，已保留：{{ drawnCount }} 个</span>
        </div>
      </template>
    </UCard>

    <!-- GeoJSON：加载 FeatureCollection，可切换数据 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksGeoJSON</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">官网 11.1</UBadge>
        </div>
      </template>
      <div ref="elGeo" class="relative rounded border border-default overflow-hidden" style="height: 320px" />
      <template #footer>
        <div class="flex gap-2 items-center">
          <UButton size="sm" @click="toggleGeo">切换 GeoJSON 数据</UButton>
          <span class="text-sm text-muted">已加载几何数：{{ geoResult.geometries.value.length }}</span>
        </div>
      </template>
    </UCard>

    <!-- Geometry 通用原语：factory 直接 new 任意几何 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">useMaptalksGeometry（逃生舱）</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
        </div>
      </template>
      <div ref="elGeom" class="relative rounded border border-default overflow-hidden" style="height: 320px" />
      <template #footer>
        <span class="text-sm text-muted">用 factory 手动 new 一个圆形几何，响应式纳管到矢量图层。</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">

const center: [number, number] = [121.4737, 31.2304];

/** 格式化经纬度显示 */
function fmt(n: number | undefined): string {
  return typeof n === 'number' ? n.toFixed(4) : '—';
}

// —— 卡片 1：事件 + 相机 + 坐标 ——
const elMain = ref<HTMLElement | null>(null);
const { map: mainMap } = useMaptalks(elMain, { center, zoom: 11, pitch: 20 });
useMaptalksTileLayer(mainMap, { source: 'osm' });

const cam = useMaptalksCamera(mainMap);
const lastClick = ref('（点击地图试试）');
// 绑定地图 click 事件，自动解绑
useMaptalksEvents(mainMap, {
  click: (e) => {
    const ev = e as { coordinate?: { x: number; y: number } };
    if (ev.coordinate) lastClick.value = `[${ev.coordinate.x.toFixed(4)}, ${ev.coordinate.y.toFixed(4)}]`;
  },
});

const coord = useMaptalksCoordinate();
const centerPixel = ref('（点按钮转换）');
/** 把地图中心的地理坐标转换为容器内屏幕像素（用 map.getCenter() 拿真正的 Coordinate 对象） */
function convertCenter() {
  const m = mainMap.value;
  if (!m) return;
  // maptalks 的 coordinateToContainerPoint 需要 Coordinate 对象（含 x/y），不能传普通数组
  const c = (m as unknown as { getCenter(): MaptalksCoordinate }).getCenter();
  const pt = coord.toContainerPoint(m, c) as { x: number; y: number } | null;
  if (pt && Number.isFinite(pt.x)) centerPixel.value = `(${Math.round(pt.x)}, ${Math.round(pt.y)}) px`;
}
/** 平滑过渡到陆家嘴 */
function flyToLujiazui() {
  cam.animateTo({ center: [121.5057, 31.2453], zoom: 14 });
}

// —— 卡片 2：绘制工具 ——
const elDraw = ref<HTMLElement | null>(null);
const { map: drawMap } = useMaptalks(elDraw, { center, zoom: 12 });
useMaptalksTileLayer(drawMap, { source: 'osm' });
const draw = useMaptalksDrawTool(drawMap, { mode: 'Polygon' });
// DrawTool 只负责“画”，画完（双击结束）默认会清除临时图形。
// 这里用一个矢量图层保留画好的图形：监听 result，把结果复制一份加到图层。
const { layer: drawLayer } = useMaptalksVectorLayer(drawMap);
const drawnCount = ref(0);
watch(draw.result, (geo) => {
  const g = geo as { copy?: () => unknown } | null;
  if (!g || !drawLayer.value) return;
  const clone = typeof g.copy === 'function' ? g.copy() : g;
  (drawLayer.value as unknown as { addGeometry(x: unknown): void }).addGeometry(clone);
  drawnCount.value += 1;
});
/** 清空已画的图形 */
function clearDrawn() {
  (drawLayer.value as unknown as { clear?: () => void } | null)?.clear?.();
  drawnCount.value = 0;
}

// —— 卡片 3：GeoJSON ——
const elGeo = ref<HTMLElement | null>(null);
const { map: geoMap } = useMaptalks(elGeo, { center, zoom: 12 });
useMaptalksTileLayer(geoMap, { source: 'osm' });
const { layer: geoLayer } = useMaptalksVectorLayer(geoMap);
const geoDataA = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [121.47, 31.23] }, properties: {} },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [121.49, 31.24] }, properties: {} },
  ],
};
const geoDataB = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[121.45, 31.22], [121.5, 31.25]] },
      properties: {},
    },
  ],
};
const geoData = ref<Record<string, unknown>>(geoDataA);
const geoResult = useMaptalksGeoJSON(geoLayer, {
  data: () => geoData.value,
  symbol: { markerType: 'ellipse', markerFill: '#f43f5e', markerWidth: 14, markerHeight: 14, lineColor: '#f43f5e', lineWidth: 3 },
});
/** 切换 GeoJSON 数据源，观察响应式重载 */
function toggleGeo() {
  geoData.value = geoData.value === geoDataA ? geoDataB : geoDataA;
}

// —— 卡片 4：通用几何原语 ——
const elGeom = ref<HTMLElement | null>(null);
const { map: geomMap } = useMaptalks(elGeom, { center, zoom: 13 });
useMaptalksTileLayer(geomMap, { source: 'osm' });
const { layer: geomLayer } = useMaptalksVectorLayer(geomMap);
useMaptalksGeometry(geomLayer, (mt) => {
  return new mt.Circle(center, 700, {
    symbol: { polygonFill: '#6366f1', polygonOpacity: 0.35, lineColor: '#4f46e5', lineWidth: 2 },
  });
});
</script>
