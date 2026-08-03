<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksScale——3 个官网布局比例尺（maxWidth × 米制/英制）（对应官网 10.16）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 3 布局：左上双比例尺 / 右上米制 / 右下英制（不同 maxWidth）
const sOpts1: MaptalksScaleOptions = { position: 'top-left', maxWidth: 100, metric: true, imperial: true }
const sOpts2: MaptalksScaleOptions = { position: 'top-right', maxWidth: 150, metric: true, imperial: false }
const sOpts3: MaptalksScaleOptions = { position: 'bottom-right', maxWidth: 200, metric: false, imperial: true }

const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
useMaptalksScale(map, { options: sOpts1 })
useMaptalksScale(map, { options: sOpts2 })
useMaptalksScale(map, { options: sOpts3 })
</script>
