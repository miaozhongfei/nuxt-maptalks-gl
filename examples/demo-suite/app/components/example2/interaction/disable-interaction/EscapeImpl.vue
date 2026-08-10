<template>
  <div>
    <div class="relative">
      <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
      <UBadge variant="subtle" class="absolute top-3 right-3 z-10">交互已禁用</UBadge>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 13,
  draggable: false,
  dragPan: false,
  dragRotate: false,
  dragPitch: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  touchZoom: false,
})
// 逃生舱底图：工厂模式，不使用命名源
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
)

const status = computed(() => (isReady.value ? '地图已创建（七个交互选项全部禁用）' : '加载中…'))
</script>
