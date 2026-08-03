<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksCompass——4 个官网布局指北针控件（pitch/bearing 旋转展示）（对应官网 10.15）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 4 布局：左上 / 右上 / 右下 / 自定义位置（maptalks-gl position 对象需数字值）
const cOpts1: MaptalksCompassOptions = { position: 'top-left' }
const cOpts2: MaptalksCompassOptions = { position: 'top-right' }
const cOpts3: MaptalksCompassOptions = { position: 'bottom-right' }
const cOpts4: MaptalksCompassOptions = { position: { bottom: 20, left: 20 } }

const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, pitch: 60, bearing: 30 })
useMaptalksTileLayer(map, { source: 'osm' })
useMaptalksCompass(map, { options: cOpts1 })
useMaptalksCompass(map, { options: cOpts2 })
useMaptalksCompass(map, { options: cOpts3 })
useMaptalksCompass(map, { options: cOpts4 })
</script>
