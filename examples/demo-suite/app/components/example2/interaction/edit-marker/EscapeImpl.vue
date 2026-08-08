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

// 逃生舱：工厂模式创建 VectorLayer + 可编辑 Marker
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksGeometry(layer, (mt) =>
  new mt.Marker([121.5057, 31.2453], {
    editable: true,
    draggable: false,
    symbol: { markerType: 'ellipse', markerFill: '#dc2626', markerWidth: 20, markerHeight: 20 },
  }),
)

function startEdit() { toValue(geometry)?.startEdit?.() }
function endEdit() { toValue(geometry)?.endEdit?.() }

const status = computed(() => (isReady.value ? '地图已创建（可编辑 Marker）' : '加载中…'))
</script>
