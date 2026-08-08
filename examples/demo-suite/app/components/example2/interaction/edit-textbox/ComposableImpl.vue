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
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksTextBox(layer, {
  content: '这是一个文本框，内容非常长',
  coordinates: [121.5057, 31.2453],
  width: 200,
  height: 90,
  options: {
    draggable: true,
    textStyle: {
      wrap: true,
      padding: [12, 8],
      verticalAlignment: 'top',
      horizontalAlignment: 'right',
      symbol: { textFaceName: 'monospace', textFill: '#34495e', textHaloFill: '#fff', textHaloRadius: 4, textSize: 18, textWeight: 'bold' },
    },
    boxSymbol: { markerType: 'square', markerFill: 'rgb(135,196,240)', markerFillOpacity: 0.9, markerLineColor: '#34495e', markerLineWidth: 1 },
  },
})

function startEdit() { toValue(geometry)?.startEdit?.() }
function endEdit() { toValue(geometry)?.endEdit?.() }

const status = computed(() => (isReady.value ? '地图已创建（可编辑文本框）' : '加载中…'))
</script>
