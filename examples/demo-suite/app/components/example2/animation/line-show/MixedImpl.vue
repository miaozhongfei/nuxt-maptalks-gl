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
    <UButton size="sm" variant="outline" class="mt-3" @click="animateShow">animateShow 展示</UButton>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
// 组合：组件创建地图，computed 桥接 map 供 composable 使用
const { layer } = useMaptalksVectorLayer(map)

const path = [[121.49, 31.25], [121.495, 31.248], [121.5057, 31.2453], [121.516, 31.242], [121.522, 31.24]] as [number, number][]
const { geometry } = useMaptalksLineString(layer, {
  coordinates: path,
  options: { visible: false, arrowStyle: 'classic', arrowPlacement: 'vertex-last', symbol: { lineColor: '#dc2626', lineWidth: 4 } },
})

function animateShow() {
  const geo = toValue(geometry)
  geo?.hide()
  geo?.animateShow({ duration: 1500, easing: 'out' })
}

const status = computed(() => (map.value ? '地图已创建（可逐段揭示路径）' : '加载中…'))
</script>
