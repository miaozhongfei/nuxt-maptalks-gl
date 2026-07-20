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
const visible = ref(true)
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const iw = new mt.InfoWindow({ title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' })
  iw.addTo(m).show([121.5057, 31.2453])
  // eslint-disable-next-line no-underscore-dangle
  ;(m as any)._iw = iw
})
</script>
