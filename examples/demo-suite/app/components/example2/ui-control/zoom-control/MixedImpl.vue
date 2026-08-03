<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksZoom——4 个官网布局 Zoom 控件（zoomLevel 开关 × 位置）（对应官网 10.14）。</p>
  </div>
</template>

<script setup lang="ts">
// 官网 4 布局：左上+级别 / 右上 / 右下+级别 / 自定义位置
const zOpts1: MaptalksZoomOptions = { position: 'top-left', zoomLevel: true }
const zOpts2: MaptalksZoomOptions = { position: 'top-right' }
const zOpts3: MaptalksZoomOptions = { position: 'bottom-right', zoomLevel: true }
const zOpts4: MaptalksZoomOptions = { position: { bottom: 20, left: 20 } }

// MaptalksMap ref 桥接：从组件实例取 map，再经 composable 创建控件
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

useMaptalksZoom(map, { options: zOpts1 })
useMaptalksZoom(map, { options: zOpts2 })
useMaptalksZoom(map, { options: zOpts3 })
useMaptalksZoom(map, { options: zOpts4 })
</script>
