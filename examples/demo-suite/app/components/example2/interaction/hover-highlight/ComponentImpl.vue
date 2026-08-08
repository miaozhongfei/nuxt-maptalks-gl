<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker
          v-for="(p, i) in points"
          :key="i"
          ref="mRefs"
          :coordinates="p.coords"
          :options="{ symbol: normalSymbol }"
          @mouseenter="onHover(i, true)"
          @mouseout="onHover(i, false)"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
// v-for 的 ref 自动收集为数组
const mRefs = ref<Array<MaptalksMarkerExposed | null>>([])

const points = reactive([
  { coords: [121.495, 31.248] as [number, number] },
  { coords: [121.5057, 31.2453] as [number, number] },
  { coords: [121.515, 31.242] as [number, number] },
])
const normalSymbol = { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 16, markerHeight: 16 }
const hoverSymbol = { markerType: 'ellipse', markerFill: '#f59e0b', markerWidth: 24, markerHeight: 24 }

// 事件回调内同步 setSymbol（与三实现同路径；exposed geometry 是 Ref——toValue 解包）
function onHover(i: number, v: boolean) {
  toValue(mRefs.value[i]?.geometry)?.setSymbol?.(v ? hoverSymbol : normalSymbol)
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（悬停高亮）' : '加载中…'))
</script>
