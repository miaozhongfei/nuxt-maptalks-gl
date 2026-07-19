<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <!-- 底层蓝色矢量图层（正常模式） -->
      <MaptalksVectorLayer>
        <MaptalksMarker
          :coordinates="[121.5057, 31.2453]"
          :symbol="{ markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 30, markerHeight: 30 }"
        />
      </MaptalksVectorLayer>
      <!-- 上层红色矢量图层（xor 混合模式） -->
      <MaptalksVectorLayer :options="{ globalCompositeOperation: 'xor' }">
        <MaptalksMarker
          :coordinates="[121.5055, 31.2451]"
          :symbol="{ markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 30, markerHeight: 30 }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-sm mt-2 text-muted">globalCompositeOperation: 'xor' — 重叠区域反色，显示画布背景</p>
  </div>
</template>
