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
      <p class="text-xs text-muted mt-1">旧 API：MaptalksMap 声明式 + watch → map.setMenu()（对应官网 10.1）。</p>
    </div>
    <div>
      <MaptalksMap
        ref="mc2"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        base-layer="osm"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      >
        <MaptalksMenu :options="menuOpts" />
      </MaptalksMap>
      <p class="text-xs text-muted mt-1">新封装：&lt;MaptalksMenu&gt; 组件声明式——items 数组配置。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// —— 旧 API：map.setMenu() ——
const mc1 = ref<MaptalksMapExposed | null>(null)
const menuItems: MaptalksMenuItem[] = [
  { item: '放大', click: () => { toValue(mc1.value?.map)?.zoomIn() } },
  { item: '缩小', click: () => { toValue(mc1.value?.map)?.zoomOut() } },
]
watch(() => mc1.value?.map, (m) => {
  if (!m) return
  m.setMenu({ width: 160, items: menuItems })
})

// —— 新封装：MaptalksMenu 组件 ——
const mc2 = ref<MaptalksMapExposed | null>(null)
const menuOpts: MaptalksMenuOptions = {
  width: 160,
  items: [
    { item: '放大', click: () => { toValue(mc2.value?.map)?.zoomIn() } },
    { item: '缩小', click: () => { toValue(mc2.value?.map)?.zoomOut() } },
  ],
}
</script>
