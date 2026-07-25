<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <!-- 碰撞检测：重叠的标注将自动避让 -->
      <MaptalksVectorLayer :options="{ collision: true }">
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } }"
        />
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 18, markerHeight: 18 } }"
        />
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :options="{ symbol: { markerType: 'ellipse', markerFill: '#16a34a', markerWidth: 18, markerHeight: 18 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-sm mt-2 text-muted">collision: true — 3 个同坐标 Marker 自动碰撞避让</p>
  </div>
</template>
