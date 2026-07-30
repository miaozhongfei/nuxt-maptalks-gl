<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton
        v-for="m in modes" :key="m" size="xs"
        :variant="mode === m ? 'solid' : 'outline'"
        @click="switchMode(m)"
      >{{ m }}</UButton>
      <UDivider orientation="vertical" />
      <UButton size="xs" variant="outline" @click="disable">禁用</UButton>
      <UButton size="xs" variant="outline" @click="enable">启用</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

const modes = ['Point', 'LineString', 'Polygon', 'Circle', 'Rectangle'] as const
const { mode, enable, disable, setMode } = useMaptalksDrawTool(map, { mode: 'Point' })

function switchMode(m: string) {
  setMode(m)
  enable()
}
</script>
