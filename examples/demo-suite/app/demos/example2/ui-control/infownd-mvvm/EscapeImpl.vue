<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="openDynamic">打开动态 InfoWindow</UButton>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const count = ref(0)
async function openDynamic() {
  const m = toValue(map); if (!m) return
  count.value++
  const mt = await import('maptalks-gl')
  const content = `<div style="padding:8px"><p>计数: ${count.value}</p><button style="display:inline-block;padding:4px 12px;margin:4px;background:#2563eb;color:#fff;border:none;border-radius:4px;cursor:pointer" onclick="alert('按钮被点击')">点我</button></div>`
  const iw = new mt.InfoWindow({ title: '动态 MVVM', content })
  iw.addTo(m).show([121.5057, 31.2453])
}
</script>
