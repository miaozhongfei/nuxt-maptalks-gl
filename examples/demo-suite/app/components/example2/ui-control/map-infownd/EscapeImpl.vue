<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" @click="toggle">{{ visible ? '隐藏' : '显示' }}信息框</UButton>
    </div>
    <div class="mt-2 text-sm text-muted space-y-0.5">
      <div v-for="(e, i) in events" :key="i">{{ e }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const lastEvent = ref('就绪')
const events = ref<string[]>([])
const visible = ref(true)
let iwRef: { show(c: unknown): void; hide(): void } | null = null
watch(() => toValue(map), async (m) => {
  if (!m) return
  const mt = await import('maptalks-gl')
  const iw = new mt.ui.InfoWindow({ title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' })
  iw.on('showstart', () => { events.value.push(`showstart ${new Date().toLocaleTimeString()}`) })
  iw.on('showend', () => { events.value.push(`showend ${new Date().toLocaleTimeString()}`) })
  iw.addTo(m).show([121.5057, 31.2453])
  iwRef = iw
}, { immediate: true })
function toggle() {
  visible.value = !visible.value
  if (visible.value) iwRef?.show([121.5057, 31.2453])
  else iwRef?.hide()
}
</script>
