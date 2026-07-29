<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 400px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 400px" />
    </div>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)

const { map: mapA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13, name: 'swipe-a' })
useMaptalksTileLayer(mapA, { source: 'osm' })

const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 13, name: 'swipe-b' })
useMaptalksTileLayer(mapB, { options: { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['b', 'c', 'd'] } })

useMaptalksSync(['swipe-a', 'swipe-b'])
</script>
