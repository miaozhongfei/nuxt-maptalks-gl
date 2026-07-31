<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <div
        ref="el1"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      />
      <p class="text-xs text-muted mt-1">旧 API：useMaptalks + watch → map.setMenu()（对应官网 10.1）。</p>
    </div>
    <div>
      <div
        ref="el2"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      />
      <p class="text-xs text-muted mt-1">新封装：useMaptalksMenu composable——items 数组配置。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// —— 旧 API：map.setMenu() ——
const el1 = ref<HTMLElement | null>(null)
const { map: map1 } = useMaptalks(el1, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map1, { source: 'osm' })
watch(() => toValue(map1), (m) => {
  if (!m) return
  m.setMenu({
    width: 160,
    items: [
      { item: '放大', click: () => { m.zoomIn() } },
      { item: '缩小', click: () => { m.zoomOut() } },
    ],
  })
})

// —— 新封装：useMaptalksMenu ——
const el2 = ref<HTMLElement | null>(null)
const { map: map2 } = useMaptalks(el2, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map2, { source: 'osm' })
useMaptalksMenu(map2, {
  options: {
    width: 160,
    items: [
      { item: '放大', click: () => { toValue(map2)?.zoomIn() } },
      { item: '缩小', click: () => { toValue(map2)?.zoomOut() } },
    ],
  },
})
</script>
