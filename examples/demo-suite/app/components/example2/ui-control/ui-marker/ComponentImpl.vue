<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    >
      <MaptalksVectorLayer>
        <!-- 锚点参照：5×5 椭圆 Marker -->
        <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="{ symbol: { markerType: 'ellipse', markerFill: '#000', markerWidth: 5, markerHeight: 5 } }" />
      </MaptalksVectorLayer>
      <!-- UIMarker 对齐跟随下拉实时更新（computed options → 响应式重建） -->
      <MaptalksUIMarker :coordinates="[121.5057, 31.2453]" :options="uimOpts" />
    </MaptalksMap>
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
    <p class="text-sm text-muted mt-2">UIMarker 组件——computed options 响应式重建（对应官网 10.8）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const hAlign = ref<'middle' | 'left' | 'right'>('middle')
const vAlign = ref<'middle' | 'top' | 'bottom'>('middle')

// computed options：alignment 变化 → stableOpts dequal 变化 → composable 重建 UIMarker
const uimOpts = computed<MaptalksUIMarkerOptions>(() => ({
  content: '<div style="background:#2563eb;color:#fff;padding:4px 8px;border-radius:4px;white-space:nowrap">maptalks</div>',
  horizontalAlignment: hAlign.value,
  verticalAlignment: vAlign.value,
}))

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（UIMarker 对齐可切换）' : '加载中…'))
</script>
