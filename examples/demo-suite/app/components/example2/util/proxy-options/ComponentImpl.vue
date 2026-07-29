<template>
  <div>
    <MaptalksMap
      ref="mc"
      base-layer="osm"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <!-- 矢量图层 + Marker：通过组件声明供后续 options.visible Proxy 操作 -->
    </MaptalksMap>
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
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => mc.value?.map ?? null)

// 组件创建地图 + composable 创建矢量图层用于 visibility 演示
const { layer: vectorLayer } = useMaptalksLayer(map, (mt) => {
  const vl = new mt.VectorLayer('v')
  vl.addGeometry(new mt.Marker([121.5057, 31.2453]))
  return vl
})

const opacity = ref(1)
let crossOn = false

function toggleCross(e: Event) {
  const m = toValue(map)
  if (!m) return
  crossOn = (e.target as HTMLInputElement).checked
  // MaptalksMap 组件声明式创建地图，template ref 获取实例后走 Proxy options
  ;(m.options as any).centerCross = crossOn
}

function setOpacity(e: Event) {
  const m = toValue(map)
  if (!m) return
  const v = Number((e.target as HTMLInputElement).value)
  opacity.value = v
  // Proxy 拦截：map.options.baseLayer.options.opacity 逐级赋值
  ;(m.options as any).baseLayer.options.opacity = v
}

function toggleVisible(e: Event) {
  const vl = toValue(vectorLayer)
  if (!vl) return
  // 图层通过 composable 创建，实例上直接赋值 options.visible（Proxy 拦截）
  ;(vl.options as any).visible = (e.target as HTMLInputElement).checked
}
</script>
