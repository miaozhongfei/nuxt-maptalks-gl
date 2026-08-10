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
// 四个控件 composable，一行一个
useMaptalksZoom(map, { options: { position: 'top-left' } })
useMaptalksScale(map, { options: { position: 'bottom-left' } })
useMaptalksCompass(map, { options: { position: 'top-right' } })
useMaptalksAttribution(map, { options: { position: 'bottom-right' } })

const status = computed(() => (isReady.value ? '地图已创建（Zoom / Scale / Compass / Attribution 四角控件）' : '加载中…'))
</script>
