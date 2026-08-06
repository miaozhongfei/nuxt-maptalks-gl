<template>
  <div>
    <MaptalksMap
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      @ready="onReady"
    />
    <p class="text-sm text-muted mt-2">声明式组件：MaptalksMap + base-layer 命名源（对应官网 1.1 显示）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const status = ref('加载中…')

function onReady(map: MaptalksMap) {
  status.value = `地图已创建（zoom ${map.getZoom()}，osm 底图）`
}
</script>
