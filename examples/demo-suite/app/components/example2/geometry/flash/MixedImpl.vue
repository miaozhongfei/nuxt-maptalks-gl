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
    <!-- 闪烁操作区 -->
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" color="primary" @click="flashIt">闪烁 6 次</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksVectorLayer(map)
// 源 Marker
const { geometry } = useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 } },
})
// 原生 flash(间隔ms, 次数, 回调, 上下文) 闪烁强调（flash 已建模）
function flashIt() {
  toValue(geometry)?.flash(200, 6, () => {}, null)
}

const status = computed(() => (map.value ? '地图已创建（可闪烁）' : '加载中…'))
</script>
