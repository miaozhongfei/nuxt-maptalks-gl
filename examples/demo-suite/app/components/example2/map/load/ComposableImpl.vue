<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksTileLayer 命名源（对应官网 1.1 显示）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14, baseLayer: 'osm' })
useMaptalksTileLayer(map, { source: 'osm' })

const status = computed(() => (isReady.value ? `地图已创建（zoom ${toValue(map)?.getZoom()}，osm 底图）` : '加载中…'))
</script>
