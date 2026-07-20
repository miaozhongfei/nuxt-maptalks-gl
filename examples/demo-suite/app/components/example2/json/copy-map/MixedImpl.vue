<template>
  <div>
    <div class="grid grid-cols-2 gap-3">
      <MaptalksMap ref="mcA" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
      <MaptalksMap ref="mcB" :center="[121.5057, 31.2453]" :zoom="10" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 380px" />
    </div>
    <UButton size="sm" class="mt-3" @click="copyMap">复制地图 A - B</UButton>
  </div>
</template>

<script setup lang="ts">
const mcA = ref<{ map: any } | null>(null)
const mcB = ref<{ map: any } | null>(null)
const mapA = computed(() => mcA.value?.map ?? null)
const mapB = computed(() => mcB.value?.map ?? null)
const { toJSON: toA } = useMaptalksSerialize(mapA)
const { fromJSON: fromB } = useMaptalksSerialize(mapB)
function copyMap() {
  const json = toA()
  fromB(json)
}
</script>
