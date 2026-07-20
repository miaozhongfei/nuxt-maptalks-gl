<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <UButton size="sm" class="mt-3" @click="exportJson">导出为 JSON</UButton>
    <pre v-if="result" class="text-xs mt-2 p-3 rounded border border-default overflow-auto max-h-64">{{ result }}</pre>
    <p class="text-sm text-muted mt-2">map.toJSON 序列化地图状态（对应官网 11.3）。</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const result = ref('')
const { toJSON } = useMaptalksSerialize(map)
function exportJson() {
  const json = toJSON()
  result.value = JSON.stringify(json, null, 2)
}
</script>
