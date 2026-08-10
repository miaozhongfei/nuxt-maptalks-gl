<template>
  <!-- 组件单独：四个控件组件挂到地图四角 -->
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      @ready="onReady"
    >
      <MaptalksZoomControl :options="{ position: 'top-left' }" />
      <MaptalksScaleControl :options="{ position: 'bottom-left' }" />
      <MaptalksCompassControl :options="{ position: 'top-right' }" />
      <MaptalksAttributionControl :options="{ position: 'bottom-right' }" />
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const status = ref('加载中…')

function onReady() {
  status.value = '地图已创建（Zoom / Scale / Compass / Attribution 四角控件）'
}
</script>
