<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="mt-3 flex items-center gap-2">
      <UButton size="sm" @click="toggle">{{ visible ? '隐藏' : '显示' }}信息框</UButton>
    </div>
    <div class="mt-2 text-sm text-muted space-y-0.5">
      <div v-for="(e, i) in events" :key="i">{{ e }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
const lastEvent = ref('就绪')
const events = ref<string[]>([])
const { show, hide } = useMaptalksInfoWindow(map, {
  options: { title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' },
  events: { showstart: () => { events.value.unshift(`showstart ${new Date().toLocaleTimeString()}`) }, showend: () => { events.value.unshift(`showend ${new Date().toLocaleTimeString()}`) } },
})
const visible = ref(true)
onMounted(() => { show([121.5057, 31.2453]) })
function toggle() {
  visible.value = !visible.value
  if (visible.value) show([121.5057, 31.2453])
  else hide()
}
</script>
