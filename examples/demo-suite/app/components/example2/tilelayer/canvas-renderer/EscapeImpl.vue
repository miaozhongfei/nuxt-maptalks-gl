<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
// 工厂回调注入 maptalks-gl 命名空间（mt），renderer: 'canvas' 强制 Canvas 渲染
useMaptalksLayer(map, (mt) =>
  new mt.TileLayer('base', {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    renderer: 'canvas',
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
  }),
)

const status = computed(() => (isReady.value ? '地图已创建（renderer: canvas）' : '加载中…'))
</script>
