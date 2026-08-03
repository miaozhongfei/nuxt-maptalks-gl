<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">useMaptalks + useMaptalksZoom/useMaptalksToolbar——show/hide/remove 模块能力直接映射三操作（Remove 为销毁语义，Show 仅恢复隐藏）（对应官网 10.18）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

// Zoom 控件：show/hide/remove 三能力直接来自 composable 返回
const { show, hide, remove } = useMaptalksZoom(map, { options: { position: 'top-left', zoomLevel: true } })

// Toolbar 三按钮（Show/Hide/Remove）操作 Zoom 控件
useMaptalksToolbar(map, {
  options: {
    position: 'top-right',
    items: [
      { item: 'Show', click: () => { show() } },
      { item: 'Hide', click: () => { hide() } },
      { item: 'Remove', click: () => { remove() } },
    ],
  },
})
</script>
