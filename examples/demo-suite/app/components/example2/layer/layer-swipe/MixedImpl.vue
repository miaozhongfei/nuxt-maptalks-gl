<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <MaptalksMap
        ref="mcA"
        name="swipe-a"
        base-layer="osm"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      />
      <MaptalksMap
        ref="mcB"
        name="swipe-b"
        base-layer="osm"
        :center="[121.5057, 31.2453]"
        :zoom="13"
        class="relative rounded border border-default overflow-hidden"
        style="height: 400px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const mcB = ref<MaptalksMapExposed | null>(null)
const mapB = computed(() => mcB.value?.map ?? null)
useMaptalksTileLayer(mapB, { options: { urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['b', 'c', 'd'] } })
useMaptalksSync(['swipe-a', 'swipe-b'])
</script>
