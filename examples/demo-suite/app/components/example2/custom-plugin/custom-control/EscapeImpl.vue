<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
      <UButton size="xs" @click="zoomIn">+</UButton>
      <UButton size="xs" @click="zoomOut">-</UButton>
    </div>
    <p class="text-sm text-muted mt-2">自定义 HTML 按钮作为简易控件——演示创建新控件的思路（对应官网 13.1）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
function zoomIn() { map.value?.zoomIn() }
function zoomOut() { map.value?.zoomOut() }
</script>
