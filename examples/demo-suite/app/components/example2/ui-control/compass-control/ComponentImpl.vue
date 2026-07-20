<template>
  <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" :pitch="60" :bearing="30" class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <MaptalksCompassControl :options="{ position: 'top-right' }" />
  </MaptalksMap>
  <p class="text-sm text-muted mt-2">组件方式挂载指北针控件（右上角），对应官网 10.15。</p>
</template>
