<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">组件单独示例 · 图形</h1>
    <p class="text-muted mb-6">
      演示全部 13 个矢量图形组件。几何组件必须放在 <code>MaptalksVectorLayer</code> 内部。
      为避免过多 WebGL 上下文，这里按类别分为 3 张地图集中演示。
    </p>

    <!-- 第 1 组：点 / 文字标签 / 线 / 面 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">Marker · Label · LineString · Polygon</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 3.1~3.3 / 3.10</UBadge>
        </div>
      </template>
      <MaptalksMap :center="center" :zoom="13" class="relative rounded border border-default overflow-hidden" style="height: 384px" baseLayer="osm">
        <MaptalksVectorLayer>
          <!-- 点标记：@click 演示事件回传 -->
          <MaptalksMarker
            :coordinates="[121.47, 31.23]"
            :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } }"
            @click="() => { lastClick = 'Marker 被点击' }"
          />
          <!-- 文字标签 -->
          <MaptalksLabel
            content="文字标签"
            :coordinates="[121.485, 31.238]"
            :options="{ symbol: { textFill: '#dc2626', textSize: 16 } }"
          />
          <!-- 折线 -->
          <MaptalksLineString
            :coordinates="[[121.45, 31.22], [121.47, 31.235], [121.49, 31.22]]"
            :options="{ symbol: { lineColor: '#dc2626', lineWidth: 3 } }"
          />
          <!-- 多边形（首尾闭合的环） -->
          <MaptalksPolygon
            :coordinates="[[[121.44, 31.25], [121.46, 31.25], [121.46, 31.27], [121.44, 31.27], [121.44, 31.25]]]"
            :options="{ symbol: { polygonFill: '#22c55e', polygonOpacity: 0.4, lineColor: '#16a34a', lineWidth: 2 } }"
          />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">点击事件：{{ lastClick || '（点击蓝色圆点试试）' }}</span>
      </template>
    </UCard>

    <!-- 第 2 组：圆 / 椭圆 / 矩形 / 扇形 -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">Circle · Ellipse · Rectangle · Sector</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 3.8</UBadge>
        </div>
      </template>
      <MaptalksMap :center="[121.49, 31.235]" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 384px" baseLayer="osm">
        <MaptalksVectorLayer>
          <!-- 圆：中心 + 半径（米） -->
          <MaptalksCircle
            :coordinates="[121.46, 31.24]"
            :radius="800"
            :options="{ symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 } }"
          />
          <!-- 椭圆：中心 + 宽 + 高（米） -->
          <MaptalksEllipse
            :coordinates="[121.5, 31.25]"
            :width="1600"
            :height="800"
            :options="{ symbol: { polygonFill: '#a855f7', polygonOpacity: 0.3, lineColor: '#9333ea', lineWidth: 2 } }"
          />
          <!-- 矩形：左上角 + 宽 + 高（米） -->
          <MaptalksRectangle
            :coordinates="[121.44, 31.26]"
            :width="1500"
            :height="1000"
            :options="{ symbol: { polygonFill: '#f59e0b', polygonOpacity: 0.3, lineColor: '#d97706', lineWidth: 2 } }"
          />
          <!-- 扇形：中心 + 半径 + 起始角 + 结束角 -->
          <MaptalksSector
            :coordinates="[121.53, 31.225]"
            :radius="1000"
            :start-angle="0"
            :end-angle="90"
            :options="{ symbol: { polygonFill: '#ef4444', polygonOpacity: 0.35, lineColor: '#dc2626', lineWidth: 2 } }"
          />
        </MaptalksVectorLayer>
      </MaptalksMap>
    </UCard>

    <!-- 第 3 组：Multi 系列 / 文本框 / GeoJSON -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2 flex-wrap">
          <h2 class="font-semibold">MultiPoint · MultiLineString · MultiPolygon · TextBox · GeoJSON</h2>
          <UBadge color="primary" variant="subtle">组件</UBadge>
          <UBadge color="neutral" variant="outline">官网 3.5~3.7 / 3.11</UBadge>
        </div>
      </template>
      <MaptalksMap :center="[121.47, 31.24]" :zoom="12" class="relative rounded border border-default overflow-hidden" style="height: 384px" baseLayer="osm">
        <MaptalksVectorLayer>
          <!-- 多点 -->
          <MaptalksMultiPoint
            :coordinates="[[121.45, 31.21], [121.47, 31.21], [121.49, 31.21]]"
            :options="{ symbol: { markerType: 'ellipse', markerFill: '#0ea5e9', markerWidth: 14, markerHeight: 14 } }"
          />
          <!-- 多线 -->
          <MaptalksMultiLineString
            :coordinates="[[[121.44, 31.28], [121.46, 31.29]], [[121.47, 31.28], [121.49, 31.29]]]"
            :options="{ symbol: { lineColor: '#7c3aed', lineWidth: 3 } }"
          />
          <!-- 多面 -->
          <MaptalksMultiPolygon
            :coordinates="[
              [[[121.44, 31.22], [121.45, 31.22], [121.45, 31.23], [121.44, 31.23], [121.44, 31.22]]],
              [[[121.46, 31.22], [121.47, 31.22], [121.47, 31.23], [121.46, 31.23], [121.46, 31.22]]],
            ]"
            :options="{ symbol: { polygonFill: '#14b8a6', polygonOpacity: 0.4, lineColor: '#0d9488', lineWidth: 2 } }"
          />
          <!-- 文本框：内容 + 坐标 + 宽 + 高（像素） -->
          <MaptalksTextBox
            content="文本框 TextBox"
            :coordinates="[121.5, 31.28]"
            :width="140"
            :height="40"
          />
          <!-- GeoJSON：直接渲染 FeatureCollection -->
          <MaptalksGeoJSON
            :data="geojson"
            :symbol="{ markerType: 'ellipse', markerFill: '#f43f5e', markerWidth: 12, markerHeight: 12 }"
          />
        </MaptalksVectorLayer>
      </MaptalksMap>
      <template #footer>
        <span class="text-sm text-muted">GeoJSON 数据源含 2 个点要素，与其它几何共用一个矢量图层。</span>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const center: [number, number] = [121.4737, 31.2304];
const lastClick = ref('');

// 演示用 GeoJSON FeatureCollection（两个点要素）
const geojson = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [121.51, 31.24] }, properties: { name: 'A' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [121.52, 31.25] }, properties: { name: 'B' } },
  ],
};
</script>
