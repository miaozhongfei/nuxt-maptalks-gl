<template>
  <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <MaptalksScaleControl :options="{ position: 'bottom-left' }" />
  </MaptalksMap>
  <p class="text-sm text-muted mt-2">组件方式挂载 Scale 比例尺控件（左下角），对应官网 10.16。</p>
</template>
