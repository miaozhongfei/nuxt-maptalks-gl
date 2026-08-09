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
// renderer: 'canvas' 强制瓦片图层走 Canvas 渲染
useMaptalksTileLayer(map, {
  options: {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
    renderer: 'canvas',
  },
})

const status = computed(() => (isReady.value ? '地图已创建（renderer: canvas）' : '加载中…'))
</script>
