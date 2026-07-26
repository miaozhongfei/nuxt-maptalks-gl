<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="toggle">{{ visible ? '隐藏' : '显示' }}信息框</UButton>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { show, hide } = useMaptalksInfoWindow(map, { options: { title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' } })
const visible = ref(false)
function toggle() {
  visible.value = !visible.value
  if (visible.value) show([121.5057, 31.2453])
  else hide()
}
</script>
