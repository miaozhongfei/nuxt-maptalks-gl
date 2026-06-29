<template>
  <div>
    <h1>地图控件</h1>
    <div
      data-testid="map"
      style="height: 440px; width: 100%; border: 1px solid #e0e0e0; border-radius: 8px"
    >
      <MaptalksMap :center="[121.47, 31.23]" :zoom="12">
        <MaptalksTileLayer source="osm" />
        <MaptalksZoomControl :options="{ position: 'top-left' }" />
        <MaptalksScaleControl :options="{ position: 'bottom-left' }" />
        <MaptalksAttributionControl :options="{ content: 'hello' }" />
        <MaptalksCompassControl :options="{ position: 'top-right' }" />
      </MaptalksMap>
    </div>
  </div>
</template>
