<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组合示例 · 纯 composable 命令式</h1>
    <p class="text-muted mb-6">
      完全用 composable（不用任何 <code>Maptalks*</code> 组件）搭建一张完整功能的地图：底图 + 矢量图层 + 多种几何 +
      控件 + 相机操作 + 事件 + 信息框。全部在 <code>&lt;script setup&gt;</code> 里命令式组合。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">纯 composable 全家桶</h2>
          <UBadge color="primary" variant="subtle">composable</UBadge>
          <UBadge color="neutral" variant="outline">组合</UBadge>
        </div>
      </template>
      <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 520px" />
      <template #footer>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-muted">
            相机：zoom={{ cam.zoom.value?.toFixed(2) }}，点击 {{ lastClick }}
          </div>
          <div class="flex gap-2 flex-wrap">
            <UButton size="sm" @click="cam.animateTo({ center: [121.5057, 31.2453], zoom: 14 })">飞行到陆家嘴</UButton>
            <UButton size="sm" color="neutral" @click="showIW">在中心显示信息框</UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];
const el = ref<HTMLElement | null>(null);

// 地图
const { map } = useMaptalks(el, { center, zoom: 12 });
// 底图
useMaptalksTileLayer(map, { source: 'osm' });
// 矢量图层
const { layer } = useMaptalksVectorLayer(map);
// 多种几何
useMaptalksMarker(layer, { coordinates: center, symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } });
useMaptalksLineString(layer, { coordinates: [[121.45, 31.22], [121.48, 31.24]], symbol: { lineColor: '#dc2626', lineWidth: 3 } });
useMaptalksPolygon(layer, { coordinates: [[[121.45, 31.23], [121.48, 31.23], [121.48, 31.25], [121.45, 31.25], [121.45, 31.23]]], symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 } });
useMaptalksCircle(layer, { coordinates: [121.5, 31.23], radius: 700, symbol: { polygonFill: '#6366f1', polygonOpacity: 0.3, lineColor: '#4f46e5', lineWidth: 2 } });
useMaptalksTextBox(layer, { content: '编组合', coordinates: [121.51, 31.26], width: 100, height: 36 });
// 控件
useMaptalksZoom(map, { position: 'top-left' });
useMaptalksScale(map, { position: 'bottom-left' });
useMaptalksCompass(map, { position: 'top-right' });
useMaptalksAttribution(map, { position: 'bottom-right' });
// 相机
const cam = useMaptalksCamera(map);
// 事件
const lastClick = ref('（点地图）');
useMaptalksEvents(map, { click: (e) => { const ev = e as { coordinate: { x: number; y: number } }; lastClick.value = `[${ev.coordinate.x.toFixed(4)}, ${ev.coordinate.y.toFixed(4)}]`; } });
// 信息框
const { show } = useMaptalksInfoWindow(map, { options: () => ({ title: '信息框', content: '<div style="padding:8px">纯 composable 组合的信息框</div>' }) });
function showIW() { show(center); }
</script>
