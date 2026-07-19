<template>
  <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
    <MaptalksAttributionControl :options="{ position: 'bottom-right' }" />
  </MaptalksMap>
  <p class="text-sm text-muted mt-2">组件方式挂载 Attribution 版权控件（右下角），对应官网 10.17。</p>
</template>
