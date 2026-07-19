<template>
  <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <MaptalksZoomControl :options="{ position: 'top-left' }" />
  </MaptalksMap>
  <p class="text-sm text-muted mt-2">组件方式挂载 Zoom 控件（左上角），对应官网 10.14。</p>
</template>
