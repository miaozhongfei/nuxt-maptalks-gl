<template>
  <MaptalksMap ref="mc" :center="[121.5057, 31.2453]" :zoom="13" base-layer="osm" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
  <p class="text-sm text-muted mt-2">组件建图 + Composable 挂载 Zoom 控件（左上角），对应官网 10.14。</p>
</template>

<script setup lang="ts">
const mc = ref<{ map: any } | null>(null)
const map = computed(() => mc.value?.map ?? null)
useMaptalksZoom(map, { position: 'top-left' })
</script>
