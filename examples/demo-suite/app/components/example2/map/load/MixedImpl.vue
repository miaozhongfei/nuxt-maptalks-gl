<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref 桥接 + useMaptalksTileLayer 命名源（对应官网 1.1 显示）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：组件实例取 map 后经 composable 添加图层
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
useMaptalksTileLayer(map, { source: 'osm' })

const status = computed(() => (map.value ? `地图已创建（zoom ${map.value.getZoom()}，osm 底图）` : '加载中…'))
</script>
