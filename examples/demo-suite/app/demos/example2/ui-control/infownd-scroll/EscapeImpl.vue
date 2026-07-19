<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="showScroll">显示可滚动信息框</UButton>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
async function showScroll() {
  const m = toValue(map); if (!m) return
  const mt = await import('maptalks-gl')
  const longContent = Array.from({ length: 50 }, (_, i) => '<p>第 ' + (i + 1) + ' 行：InfoWindow 滚动内容示例</p>').join('')
  const iw = new mt.InfoWindow({ title: '可滚动', content: '<div style="max-height:200px;overflow:auto">' + longContent + '</div>' })
  iw.addTo(m).show([121.5057, 31.2453])
}
</script>
