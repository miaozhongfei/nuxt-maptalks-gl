<template>
  <div>
    <h1>地图测量工具</h1>
    <p style="color: #666">DistanceTool 测距 + AreaTool 测面。</p>
    <div
      data-testid="map"
      style="height: 480px; width: 100%; border: 1px solid #e0e0e0; border-radius: 8px"
    >
      <MaptalksMap :center="[121.47, 31.23]" :zoom="12">
        <MaptalksTileLayer source="osm" />
        <MaptalksDistanceTool />
        <MaptalksAreaTool />
      </MaptalksMap>
    </div>
  </div>
</template>
