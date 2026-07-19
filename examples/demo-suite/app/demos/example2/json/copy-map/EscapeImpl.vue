<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <div ref="elA" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <div ref="elB" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyMap">复制地图 A - B</UButton>
  </div>
</template>

<script setup lang="ts">
const elA = ref<HTMLElement | null>(null)
const elB = ref<HTMLElement | null>(null)
const { map: mapA } = useMaptalks(elA, { center: [121.5057, 31.2453], zoom: 13 })
const { map: mapB } = useMaptalks(elB, { center: [121.5057, 31.2453], zoom: 10 })
useMaptalksTileLayer(mapA, { source: 'osm' })
useMaptalksTileLayer(mapB, { source: 'osm' })
const { toJSON: toA } = useMaptalksSerialize(mapA)
const { fromJSON: fromB } = useMaptalksSerialize(mapB)
function copyMap() {
  const json = toA()
  fromB(json)
}
</script>
