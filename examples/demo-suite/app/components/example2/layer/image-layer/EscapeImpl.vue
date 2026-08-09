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
useMaptalksTileLayer(map, { source: 'osm' })

// 逃生舱：使用 useMaptalksLayer 的工厂模式，创建原生 ImageLayer 并叠加 2 张图片
useMaptalksLayer(
  map,
  (mt) =>
    new mt.ImageLayer('images', [
      { url: '/images/1.png', extent: [121.49, 31.235, 121.51, 31.255], opacity: 1 },
      { url: '/images/2.png', extent: [121.5, 31.24, 121.52, 31.26], opacity: 0.4 },
    ]),
)

const status = computed(() => (isReady.value ? '地图已创建（图片图层已叠加）' : '加载中…'))
</script>
