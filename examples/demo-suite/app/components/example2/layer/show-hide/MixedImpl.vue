<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButtonGroup size="xs">
        <UButton color="red" @click="hide">隐藏</UButton>
        <UButton color="green" @click="show">显示</UButton>
        <UButton color="primary" @click="toggle">切换</UButton>
      </UButtonGroup>
      <UBadge color="primary" variant="subtle">{{ visible ? '可见' : '隐藏' }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const mc = ref<{ map: ReturnType<typeof useMaptalks>['map'] } | null>(null)
const map = computed(() => mc.value?.map ?? null)

const { layer, show, hide } = useMaptalksVectorLayer(map)
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } },
})

const visible = ref(true)
function toggle() { visible.value = !visible.value; if (visible.value) show(); else hide() }
</script>
