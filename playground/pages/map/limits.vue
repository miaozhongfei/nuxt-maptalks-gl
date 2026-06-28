<template>
  <div>
    <h1>地图能力 · 限制缩放与拖拽旋转</h1>
    <p style="color: #666">通过 MaptalksMap 组件的快捷 prop 限制缩放区间并开启拖拽倾斜/旋转。</p>
    <MaptalksMap
      :center="[121.4737, 31.2304]"
      :zoom="11"
      :min-zoom="9"
      :max-zoom="15"
      :drag-pitch="true"
      :drag-rotate="true"
      data-testid="map"
      class="map"
    >
      <MaptalksTileLayer source="osm" />
    </MaptalksMap>
  </div>
</template>

<style scoped>
.map {
  height: 440px;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
