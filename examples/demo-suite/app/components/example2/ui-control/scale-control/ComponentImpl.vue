<template>
  <div>
    <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksScaleControl :options="sOpts1" />
      <MaptalksScaleControl :options="sOpts2" />
      <MaptalksScaleControl :options="sOpts3" />
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksScaleControl——3 个官网布局比例尺（maxWidth × 米制/英制）（对应官网 10.16）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 3 布局：左上双比例尺 / 右上米制 / 右下英制（不同 maxWidth）
const sOpts1: MaptalksScaleOptions = { position: 'top-left', maxWidth: 100, metric: true, imperial: true }
const sOpts2: MaptalksScaleOptions = { position: 'top-right', maxWidth: 150, metric: true, imperial: false }
const sOpts3: MaptalksScaleOptions = { position: 'bottom-right', maxWidth: 200, metric: false, imperial: true }
</script>
