<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="startEdit">开始编辑</UButton>
      <UButton size="sm" variant="outline" @click="endEdit">结束编辑</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksLabel(layer, {
  content: 'label with box',
  coordinates: [121.5057, 31.2453],
  options: { textSymbol: { textFaceName: 'sans-serif', textFill: '#fff', textSize: 18 }, boxStyle: { padding: [12, 8], symbol: { markerType: 'square', markerFill: '#34495e', markerFillOpacity: 0.9, markerLineColor: '#34495e', markerLineWidth: 1 } } },
})

function startEdit() { (toValue(geometry) as any)?.startEditText?.() }
function endEdit() { (toValue(geometry) as any)?.endEditText?.() }
</script>
