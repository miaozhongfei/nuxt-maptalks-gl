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
let iwRef: { show(c: unknown): void; hide(): void } | null = null
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const iw = new mt.ui.InfoWindow({ title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' })
  iw.addTo(m).show([121.5057, 31.2453])
  iw.on('click', () => alert('InfoWindow 被点击了！'))
  iwRef = iw
}, { immediate: true })
function toggle() {
  visible.value = !visible.value
  if (visible.value) iwRef?.show([121.5057, 31.2453])
  else iwRef?.hide()
}
</script>
