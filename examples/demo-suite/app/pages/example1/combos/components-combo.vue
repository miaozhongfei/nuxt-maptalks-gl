<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组合示例 · 纯组件声明式</h1>
    <p class="text-muted mb-6">
      一张地图内同时使用多种声明式组件：底图 + 矢量图层 + 多种几何 + 控件 + 测量工具 + 信息框。全部通过模板嵌套，零 <code>&lt;script&gt;</code> 逻辑。
    </p>

    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">组件全家桶：Map + Tile + Vector + Geometries + Controls + Tool + InfoWindow</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">组合</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 520px" baseLayer="osm">
        <!-- 矢量图层 + 多种几何 -->
        <MaptalksVectorLayer>
          <MaptalksMarker
            :coordinates="center"
            :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } }"
          />
          <MaptalksLineString
            :coordinates="[[121.45, 31.22], [121.48, 31.24]]"
            :options="{ symbol: { lineColor: '#dc2626', lineWidth: 3 } }"
          />
          <MaptalksPolygon
            :coordinates="[[[121.45, 31.23], [121.48, 31.23], [121.48, 31.25], [121.45, 31.25], [121.45, 31.23]]]"
            :options="{ symbol: { polygonFill: '#22c55e', polygonOpacity: 0.35, lineColor: '#16a34a', lineWidth: 2 } }"
          />
          <MaptalksCircle
            :coordinates="[121.5, 31.23]"
            :radius="700"
            :options="{ symbol: { polygonFill: '#6366f1', polygonOpacity: 0.3, lineColor: '#4f46e5', lineWidth: 2 } }"
          />
          <MaptalksTextBox content="组件组合" :coordinates="[121.51, 31.26]" :width="100" :height="36" />
        </MaptalksVectorLayer>
        <!-- 四个常用控件 -->
        <MaptalksZoomControl :options="{ position: 'top-left' }" />
        <MaptalksScaleControl :options="{ position: 'bottom-left' }" />
        <MaptalksCompassControl :options="{ position: 'top-right' }" />
        <MaptalksAttributionControl :options="{ position: 'bottom-right' }" />
        <!-- 测距工具 -->
        <MaptalksDistanceTool />
        <!-- 信息框（点击地图弹出） -->
        <MaptalksInfoWindow :coordinates="clickCoord" :visible="showIWC">
          <div style="padding: 6px 12px">
            <strong style="color: #2563eb">组件组合信息框</strong>
            <p style="margin: 4px 0 0; font-size: 13px">{{ clickCoord[0].toFixed(5) }}, {{ clickCoord[1].toFixed(5) }}</p>
          </div>
        </MaptalksInfoWindow>
      </MaptalksMap>
      <template #footer>
        <div class="text-sm text-muted">
          一张地图上同时展示了：Tile 底图 + VectorLayer + Marker/LineString/Polygon/Circle/TextBox +
          Zoom/Scale/Compass/Attribution 控件 + DistanceTool + InfoWindow。操作：直接在地图上画测距，点击任意位置打开信息框。
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];
const clickCoord = ref<[number, number]>([121.4737, 31.2304]);
const showIWC = ref(false);
</script>
