<template>
  <div>
    <MaptalksMap :center="[121.5057, 31.2453]" :zoom="13" :pitch="60" :bearing="30" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px">
      <MaptalksCompassControl :options="cOpts1" />
      <MaptalksCompassControl :options="cOpts2" />
      <MaptalksCompassControl :options="cOpts3" />
      <MaptalksCompassControl :options="cOpts4" />
    </MaptalksMap>
    <p class="text-sm text-muted mt-2">MaptalksMap + MaptalksCompassControl——4 个官网布局指北针控件（pitch/bearing 旋转展示）（对应官网 10.15）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 4 布局：左上 / 右上 / 右下 / 自定义位置（maptalks-gl position 对象需数字值）
const cOpts1: MaptalksCompassOptions = { position: 'top-left' }
const cOpts2: MaptalksCompassOptions = { position: 'top-right' }
const cOpts3: MaptalksCompassOptions = { position: 'bottom-right' }
const cOpts4: MaptalksCompassOptions = { position: { bottom: 20, left: 20 } }
</script>
