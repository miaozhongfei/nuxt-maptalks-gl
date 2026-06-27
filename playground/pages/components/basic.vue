<template>
  <div>
    <h1>声明式组件 · 第一张地图</h1>
    <p style="color: #666">
      <code>&lt;MaptalksMap&gt;</code> + <code>&lt;MaptalksTileLayer&gt;</code>——零 setup 样板，
      全在模板里声明，组件内部自动调用 composable。
    </p>
    <div style="height: 480px; width: 100%; border: 1px solid #e0e0e0; border-radius: 8px">
      <MaptalksMap :center="[121.4737, 31.2304]" :zoom="11">
        <MaptalksTileLayer source="osm" />
      </MaptalksMap>
    </div>
  </div>
</template>
