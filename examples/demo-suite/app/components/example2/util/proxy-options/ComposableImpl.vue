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
useMaptalksTileLayer(map, { source: 'osm' })

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
  // composable 返回 map，直接赋值 map.options（Proxy 拦截 → config）
  ;(m.options as any).centerCross = crossOn
}

function setOpacity(e: Event) {
  const m = toValue(map)
  if (!m) return
  const v = parseFloat((e.target as HTMLInputElement).value)
  opacity.value = v
  // Proxy 拦截：map.options.baseLayer 次级 Proxy → options.opacity 赋值等效 config
  ;(m.options as any).baseLayer.options.opacity = v
}

function toggleVisible(e: Event) {
  const vl = toValue(vectorLayer)
  if (!vl) return
  // composable 返回 layer ref，直接赋值 layer.options.visible（Proxy 拦截）
  ;(vl.options as any).visible = (e.target as HTMLInputElement).checked
}
</script>
