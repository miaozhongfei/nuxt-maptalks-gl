<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksZoom/useMaptalksToolbar——show/hide/remove 三操作（Remove 为销毁语义，Show 仅恢复隐藏）（对应官网 10.18）。</p>
  </div>
</template>

<script setup lang="ts">
// MaptalksMap ref 桥接：从组件实例取 map，再经 composable 创建控件
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const { show, hide, remove } = useMaptalksZoom(map, { options: { position: 'top-left', zoomLevel: true } })

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
