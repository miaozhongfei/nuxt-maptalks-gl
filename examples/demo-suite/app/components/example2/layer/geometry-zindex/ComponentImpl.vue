<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <!-- 底层：蓝色 zIndex=5（后声明，在模板中靠后则叠加在上层 --><!-- 因为模板渲染顺序决定了添加顺序，先渲染的先添加，后渲染的覆盖在前 -->
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } }"
        />
        <!-- 上层：红色 zIndex=10（后声明 → 模板顺序靠后 → 绘制在上层） -->
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 10, markerHeight: 10 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-sm mt-2 text-muted">模板声明顺序：红色在后 → 绘制在上层（类似 zIndex 效果）</p>
  </div>
</template>
