<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksAttribution——2 个官网布局版权控件（默认位置/自定义位置 × content）（对应官网 10.17）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// 官网 2 布局：右下默认位置 / 右上自定义位置（数字值），不同 content
const aOpts1: MaptalksAttributionOptions = { position: 'bottom-right', content: 'One Attribution Control' }
const aOpts2: MaptalksAttributionOptions = { position: { top: 5, right: 5 }, content: 'Another Attribution Control' }

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
useMaptalksAttribution(map, { options: aOpts1 })
useMaptalksAttribution(map, { options: aOpts2 })

const status = computed(() => (isReady.value ? '地图已创建（版权控件可用）' : '加载中…'))
</script>
