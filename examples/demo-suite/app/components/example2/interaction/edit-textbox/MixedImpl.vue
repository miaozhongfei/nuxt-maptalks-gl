<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
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
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksTextBox(layer, {
  content: '可编辑文本框',
  coordinates: [121.5057, 31.2453],
  width: 200,
  height: 60,
  options: { editable: true, symbol: { textFaceName: 'sans-serif', textFill: '#1f2937', textSize: 16, boxFill: '#fef3c7', boxOpacity: 0.8 } },
})

function startEdit() { toValue(geometry)?.startEdit?.() }
function endEdit() { toValue(geometry)?.endEdit?.() }
</script>
