<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="xs" variant="outline" @click="flyNear">flyTo 飞近</UButton>
      <UButton size="xs" variant="outline" @click="flyFar">flyTo 飞远</UButton>
      <UDivider orientation="vertical" />
      <UButton size="xs" variant="outline" @click="animA">animateTo A</UButton>
      <UButton size="xs" variant="outline" @click="animB">animateTo B</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const cam = useMaptalksCamera(map)

function flyNear() { cam.flyTo({ center: [121.5057, 31.2453], zoom: 15 }, { duration: 2000 }) }
function flyFar() { cam.flyTo({ center: [121.5057, 31.2453], zoom: 5 }, { duration: 2000 }) }
function animA() { cam.animateTo({ center: [121.5057, 31.2453], zoom: 14, bearing: 30 }, { duration: 5000 }) }
function animB() { cam.animateTo({ center: [121.5057, 31.2453], zoom: 16, pitch: 45, bearing: 180 }, { duration: 4000 }) }

const status = computed(() => (isReady.value ? '地图已创建（可飞行/动画到目标）' : '加载中…'))
</script>
