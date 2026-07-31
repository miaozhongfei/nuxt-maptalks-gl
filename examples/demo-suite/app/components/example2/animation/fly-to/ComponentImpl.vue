<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
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
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

function flyNear() { toValue(map)?.flyTo({ center: [121.5057, 31.2453], zoom: 15 }, { duration: 2000 }) }
function flyFar() { toValue(map)?.flyTo({ center: [121.5057, 31.2453], zoom: 5 }, { duration: 2000 }) }
function animA() { toValue(map)?.animateTo({ center: [121.5057, 31.2453], zoom: 14, bearing: 30 }, { duration: 5000 }) }
function animB() { toValue(map)?.animateTo({ center: [121.5057, 31.2453], zoom: 16, pitch: 45, bearing: 180 }, { duration: 4000 }) }
</script>
