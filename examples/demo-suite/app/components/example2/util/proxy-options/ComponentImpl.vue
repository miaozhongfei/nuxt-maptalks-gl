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
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="setZoom(12)">设为 zoom=12</UButton>
      <UButton size="sm" variant="outline" @click="setZoom(15)">设为 zoom=15</UButton>
      <UBadge variant="subtle">当前 zoom={{ currentZoom }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MaptalksMapExposed } from '../../../../../../src/runtime/types/exposed'

const mc = ref<MaptalksMapExposed | null>(null)
const currentZoom = ref(13)

function setZoom(z: number) {
  const m = mc.value?.map
  if (!m) return
  // 组件通过 template ref 获取 map 实例，再直调 config() 运行时热更新
  m.config({ zoom: z })
  currentZoom.value = z
}
</script>
