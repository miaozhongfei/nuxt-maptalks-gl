<template>
  <div>
    <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="toggle">{{ visible ? '隐藏' : '显示' }}信息框</UButton>
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
const { show, hide } = useMaptalksInfoWindow(map, { options: { title: '信息框', content: '<div style=padding:8px>Hello InfoWindow</div>' }, events: { click: () => alert('InfoWindow 被点击了！') } })
const visible = ref(true)
onMounted(() => { show([121.5057, 31.2453]) })
function toggle() {
  visible.value = !visible.value
  if (visible.value) show([121.5057, 31.2453])
  else hide()
}
</script>
