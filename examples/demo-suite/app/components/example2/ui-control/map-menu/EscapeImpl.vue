<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div v-if="menuVisible" class="absolute z-50 bg-white rounded shadow-lg border border-default p-1" :style="menuStyle">
      <button class="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded" @click="zoomIn">放大</button>
      <button class="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded" @click="zoomOut">缩小</button>
    </div>
    <p class="text-sm text-muted mt-2">在地图上右键弹出自定义菜单（对应官网 10.1）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

const menuVisible = ref(false)
const menuStyle = ref({ top: '0px', left: '0px' })

function zoomIn() { map.value?.zoomIn(); menuVisible.value = false }
function zoomOut() { map.value?.zoomOut(); menuVisible.value = false }

watch(() => toValue(map), (m) => {
  if (!m) return
  m.on('contextmenu', (e: any) => {
    const pt = (m as any).coordToContainerPoint(e.coordinate)
    menuStyle.value = { top: pt.y + 'px', left: pt.x + 'px' }
    menuVisible.value = true
  })
  m.on('click', () => { menuVisible.value = false })
  m.on('moving', () => { menuVisible.value = false })
})
</script>
