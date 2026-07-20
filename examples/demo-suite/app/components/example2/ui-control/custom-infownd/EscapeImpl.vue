<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="showInfo">打开自定义信息框</UButton>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
async function showInfo() {
  const m = toValue(map); if (!m) return
  const mt = await import('maptalks-gl')
  const iw = new mt.InfoWindow({ title: '自定义', content: '<div style="padding:12px;background:#fef3c7;border-radius:6px;font-size:14px">自定义 HTML 内容的 InfoWindow</div>' })
  iw.addTo(m).show([121.5057, 31.2453])
}
</script>
