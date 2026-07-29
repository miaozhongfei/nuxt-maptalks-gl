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
  // 组件创建地图，computed 桥接获取实例，Proxy 拦截：map.options.centerCross 赋值
  ;(m.options as any).centerCross = crossOn
}

function setOpacity(e: Event) {
  const m = toValue(map)
  if (!m) return
  const v = parseFloat((e.target as HTMLInputElement).value)
  opacity.value = v
  // Proxy 拦截：map.options.baseLayer.options.opacity 赋值
  ;(m.options as any).baseLayer.options.opacity = v
}

function toggleVisible(e: Event) {
  const vl = toValue(vectorLayer)
  if (!vl) return
  // 组合：composable 创建图层，Proxy 拦截：layer.options.visible 赋值
  ;(vl.options as any).visible = (e.target as HTMLInputElement).checked
}
</script>
