<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <div class="flex items-center gap-4 mt-3 flex-wrap">
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" @change="toggleCross" />
        十字准星 (centerCross)
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input type="range" min="0" max="1" step="0.1" :value="opacity" @input="setOpacity" />
        底图透明度 {{ opacity }}
      </label>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" checked @change="toggleVisible" />
        图层可见
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
// 底图瓦片层（capture 返回值以便后续操作 options.opacity Proxy）
const { layer: baseLayer } = useMaptalksTileLayer(map, { source: 'osm' })
// 矢量图层 + Marker（使用预设 composable，非裸 useMaptalksLayer 工厂）
const { layer: vectorLayer } = useMaptalksVectorLayer(map, { id: 'v' })
useMaptalksMarker(vectorLayer, { coordinates: [121.5057, 31.2453] })

const opacity = ref(1)
let crossOn = false

function toggleCross(e: Event) {
  const m = toValue(map)
  if (!m) return
  crossOn = (e.target as HTMLInputElement).checked
  // composable 返回 map ref，Proxy 拦截：map.options 赋值
  ;(m.options as any).centerCross = crossOn
}

function setOpacity(e: Event) {
  const bl = toValue(baseLayer)
  if (!bl) return
  const v = Number((e.target as HTMLInputElement).value)
  opacity.value = v
  // 预设 composable 返回的 TileLayer，Proxy 拦截：layer.options.opacity 赋值
  ;(bl.options as any).opacity = v
}

function toggleVisible(e: Event) {
  const vl = toValue(vectorLayer)
  if (!vl) return
  // 预设 composable 返回的 VectorLayer，Proxy 拦截：layer.options.visible 赋值
  ;(vl.options as any).visible = (e.target as HTMLInputElement).checked
}
</script>
