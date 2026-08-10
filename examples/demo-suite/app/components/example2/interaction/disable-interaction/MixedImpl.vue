<template>
  <div>
    <div class="relative">
      <MaptalksMap
        ref="mc"
        base-layer="osm"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        :draggable="false"
        :drag-rotate="false"
        :drag-pitch="false"
        :options="{ dragPan: false, scrollWheelZoom: false, doubleClickZoom: false, touchZoom: false }"
        class="relative rounded border border-default overflow-hidden"
        style="height: 480px"
      />
      <UBadge variant="subtle" class="absolute top-3 right-3 z-10">交互已禁用</UBadge>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图 + badge，map ref 供 composable 链路使用
useMaptalksTileLayer(map, { source: 'osm' })

const status = computed(() => (map.value ? '地图已创建（七个交互选项全部禁用）' : '加载中…'))
</script>
