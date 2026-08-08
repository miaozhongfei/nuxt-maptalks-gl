<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    />
    <div class="mt-3 flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm">horizontalAlignment</span>
        <USelect v-model="hAlign" :items="['middle', 'left', 'right']" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm">verticalAlignment</span>
        <USelect v-model="vAlign" :items="['middle', 'top', 'bottom']" size="sm" />
      </div>
    </div>
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksUIMarker——options getter 响应式重建（对应官网 10.8）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const hAlign = ref<'middle' | 'left' | 'right'>('middle')
const vAlign = ref<'middle' | 'top' | 'bottom'>('middle')

const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

// 锚点参照：5×5 椭圆 Marker
const { layer } = useMaptalksVectorLayer(map)
useMaptalksMarker(layer, {
  coordinates: [121.5057, 31.2453],
  options: { symbol: { markerType: 'ellipse', markerFill: '#000', markerWidth: 5, markerHeight: 5 } },
})

useMaptalksUIMarker(map, {
  options: () => ({
    content: '<div style="background:#2563eb;color:#fff;padding:4px 8px;border-radius:4px;white-space:nowrap">maptalks</div>',
    horizontalAlignment: hAlign.value,
    verticalAlignment: vAlign.value,
    coordinates: [121.5057, 31.2453],
  }),
})

const status = computed(() => (map.value ? '地图已创建（UIMarker 对齐可切换）' : '加载中…'))
</script>
