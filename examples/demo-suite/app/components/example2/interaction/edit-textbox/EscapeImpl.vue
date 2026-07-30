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

// 逃生舱：工厂模式创建 VectorLayer + 可编辑 TextBox
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksGeometry(layer, (mt) =>
  new mt.TextBox('可编辑文本框', [121.5057, 31.2453], 200, 60, {
    symbol: { textFaceName: 'sans-serif', textFill: '#1f2937', textSize: 16, boxFill: '#fef3c7', boxOpacity: 0.8 },
    editable: true,
  }),
)

function startEdit() { toValue(geometry)?.startEdit?.() }
function endEdit() { toValue(geometry)?.endEdit?.() }

// geometry 就绪后自动进入编辑模式（匹配官网示例行为）
watch(() => toValue(geometry), (g) => { if (g) g.startEdit?.() }, { once: true })
</script>
