<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <MaptalksMap
        ref="mc1"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      />
      <p class="text-xs text-muted mt-1">旧 API：MaptalksMap ref + watch → map.setMenu()（对应官网 10.1）。</p>
    </div>
    <div>
      <MaptalksMap
        ref="mc2"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      />
      <p class="text-xs text-muted mt-1">新封装：MaptalksMap ref + useMaptalksMenu composable。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// —— 旧 API：map.setMenu() ——
const mc1 = ref<MaptalksMapExposed | null>(null)
const map1 = computed(() => toValue(mc1.value?.map) ?? null)
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
const mc2 = ref<MaptalksMapExposed | null>(null)
const map2 = computed(() => toValue(mc2.value?.map) ?? null)
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
