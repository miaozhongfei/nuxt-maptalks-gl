<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="showCtxMenu = !showCtxMenu">切换自定义菜单</UButton>
    <div v-if="showCtxMenu" class="absolute top-12 left-2 z-50 bg-white rounded shadow-lg border border-default p-2">
      <button class="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded" @click="zoomIn">放大</button>
      <button class="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded" @click="zoomOut">缩小</button>
      <button class="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded" @click="showCtxMenu = false">关闭</button>
    </div>
    <p class="text-sm text-muted mt-2">自定义 HTML 右键菜单叠加层（对应官网 10.3）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const showCtxMenu = ref(false)
function zoomIn() { map.value?.zoomIn(); showCtxMenu.value = false }
function zoomOut() { map.value?.zoomOut(); showCtxMenu.value = false }
</script>
