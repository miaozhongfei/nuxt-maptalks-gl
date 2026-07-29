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
      <MaptalksVectorLayer ref="vlRef" id="v">
        <MaptalksMarker :coordinates="[121.5057, 31.2453]" />
      </MaptalksVectorLayer>
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
const vlRef = ref<{ layer: ShallowRef<MaptalksVectorLayer | null>; show: () => void; hide: () => void } | null>(null)

const opacity = ref(1)
let crossOn = false

function toggleCross(e: Event) {
  const m = mc.value?.map
  if (!m) return
  crossOn = (e.target as HTMLInputElement).checked
  // 组件创建地图，template ref 获取实例，Proxy 拦截：map.options.centerCross 赋值
  ;(m as any).options.centerCross = crossOn
}

function setOpacity(e: Event) {
  const m = mc.value?.map
  if (!m) return
  const v = Number((e.target as HTMLInputElement).value)
  opacity.value = v
  // 组件 base-layer prop 创建的底图 TileLayer，通过 map.getBaseLayer() 获取实例
  const bl = (m as any).getBaseLayer()
  if (bl) bl.options.opacity = v
}

function toggleVisible(e: Event) {
  // 组件 <MaptalksVectorLayer> 通过 defineExpose 暴露 layer shallowRef
  const l = toValue(vlRef.value?.layer)
  if (!l) return
  // Proxy 拦截：layer.options.visible 赋值等效 layer.config('visible', ...)
  ;(l.options as any).visible = (e.target as HTMLInputElement).checked
}
</script>
