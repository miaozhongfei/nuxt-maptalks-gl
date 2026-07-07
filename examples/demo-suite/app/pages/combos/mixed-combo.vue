<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组合示例 · 组件 + composable 混合</h1>
    <p class="text-muted mb-6">
      地图用声明式组件 <code>&lt;MaptalksMap&gt;</code> 创建，其余功能（图层/几何/控件/相机/事件）通过
      composable 接入：<code>mapCmp.value?.map</code> 拿到地图实例后传给各 composable。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">组件壳 + composable 组合</h2>
          <UBadge color="primary" variant="subtle">混合</UBadge>
          <UBadge color="neutral" variant="outline">组合 · 参考 playground test/combo1</UBadge>
        </div>
      </template>
      <!-- 地图外壳用组件声明式创建 -->
      <MaptalksMap ref="mapCmp" :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 500px">
        <MaptalksTileLayer source="osm" />
      </MaptalksMap>
      <template #footer>
        <div class="flex flex-col gap-2">
          <div class="text-sm text-muted">
            地图：组件 <code>MaptalksMap</code>；其余全部 composable。zoom={{ cam.zoom.value?.toFixed(2) }}
          </div>
          <div class="flex gap-2 flex-wrap">
            <UButton size="sm" @click="cam.animateTo({ center: [121.5057, 31.2453], zoom: 14 })">飞行到陆家嘴</UButton>
            <UButton size="sm" color="neutral" @click="cam.panBy([150, 0])">右移</UButton>
            <UButton size="sm" color="neutral" @click="showIW">在中心显示信息框</UButton>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];

// 通过 ref 拿到组件 expose 的 map
const mapCmp = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null);
const mixMap = computed(() => mapCmp.value?.map ?? null);

// composable 经 computed map 接入
const { layer } = useMaptalksVectorLayer(mixMap);
useMaptalksMarker(layer, { coordinates: center, symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } });
useMaptalksLineString(layer, { coordinates: [[121.45, 31.22], [121.48, 31.24]], symbol: { lineColor: '#dc2626', lineWidth: 3 } });
useMaptalksPolygon(layer, { coordinates: [[[121.45, 31.23], [121.48, 31.23], [121.48, 31.25], [121.45, 31.25], [121.45, 31.23]]], symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 } });

// 控件
useMaptalksZoom(mixMap, { position: 'top-left' });
useMaptalksScale(mixMap, { position: 'bottom-left' });

// 相机
const cam = useMaptalksCamera(mixMap);

// 信息框
const { show } = useMaptalksInfoWindow(mixMap, { options: () => ({ title: '混合信息框', content: '<div style="padding:8px">组件壳 + composable 组合</div>' }) });
function showIW() { show(center); }
</script>
