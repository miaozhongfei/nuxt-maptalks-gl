<template>
  <div>
    <div class="relative">
      <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
      <UBadge variant="subtle" class="absolute top-3 right-3 z-10">交互已禁用</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, {
  center: [121.5057, 31.2453],
  zoom: 13,
  draggable: false,
  dragPan: false,
  dragRotate: false,
  dragPitch: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  touchZoom: false,
})
useMaptalksTileLayer(map, { source: 'osm' })
</script>
