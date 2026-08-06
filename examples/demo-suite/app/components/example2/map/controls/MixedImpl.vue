<template>
  <!-- 组合：组件建图，控件全部用 composable 挂载 -->
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
useMaptalksZoom(map, { position: 'top-left' })
useMaptalksScale(map, { position: 'bottom-left' })
useMaptalksCompass(map, { position: 'top-right' })
useMaptalksAttribution(map, { position: 'bottom-right' })

const status = computed(() => (map.value ? '地图已创建（Zoom / Scale / Compass / Attribution 四角控件）' : '加载中…'))
</script>
