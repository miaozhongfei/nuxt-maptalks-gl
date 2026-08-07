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
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
const { layer: baseLayer } = useMaptalksTileLayer(map, { source: 'osm' })
const { layer: vectorLayer } = useMaptalksVectorLayer(map, { id: 'v' })
useMaptalksMarker(vectorLayer, { coordinates: [121.5057, 31.2453] })

const opacity = ref(1)
let crossOn = false

function toggleCross(e: Event) {
  const m = toValue(map)
  if (!m) return
  crossOn = (e.target as HTMLInputElement).checked
  // options 是 maptalks Proxy——直接赋值即触发 config
  m.options.centerCross = crossOn
}

function setOpacity(e: Event) {
  const bl = toValue(baseLayer)
  if (!bl) return
  const v = Number((e.target as HTMLInputElement).value)
  opacity.value = v
  bl.options.opacity = v
}

function toggleVisible(e: Event) {
  const vl = toValue(vectorLayer)
  if (!vl) return
  vl.options.visible = (e.target as HTMLInputElement).checked
}

const status = computed(() => (isReady.value ? '地图已创建（Proxy options 直接赋值生效）' : '加载中…'))
</script>
