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
      <UButton size="sm" variant="outline" @click="grow">变大</UButton>
      <UButton size="sm" variant="outline" @click="shrink">变小</UButton>
      <UButton size="sm" variant="outline" @click="reset">重置</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
const { layer } = useMaptalksVectorLayer(map)
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 20, markerHeight: 20 } },
})

function grow() { toValue(geometry)?.animate?.({ symbol: { markerWidth: 40, markerHeight: 40 } }, { duration: 1500 }) }
function shrink() { toValue(geometry)?.animate?.({ symbol: { markerWidth: 20, markerHeight: 20 } }, { duration: 1500 }) }
function reset() { toValue(geometry)?.updateSymbol({ markerWidth: 20, markerHeight: 20 }) }

const status = computed(() => (map.value ? '地图已创建（Marker 变形动画）' : '加载中…'))
</script>
