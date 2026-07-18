<template>
  <!-- 组件单独：四个控件组件挂到地图四角 -->
  <MaptalksMap
    :center="[-0.113049, 51.498568]"
    :zoom="14"
    base-layer="osm"
    class="relative rounded border border-default overflow-hidden"
    style="height: 480px"
  >
    <MaptalksZoomControl :options="{ position: 'top-left' }" />
    <MaptalksScaleControl :options="{ position: 'bottom-left' }" />
    <MaptalksCompassControl :options="{ position: 'top-right' }" />
    <MaptalksAttributionControl :options="{ position: 'bottom-right' }" />
  </MaptalksMap>
</template>
