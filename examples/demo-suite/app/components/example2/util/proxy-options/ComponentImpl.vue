<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksTileLayer ref="blRef" source="osm" />
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
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const blRef = ref<MaptalksTileLayerExposed | null>(null)
const vlRef = ref<MaptalksVectorLayerExposed | null>(null)

const opacity = ref(1)
let crossOn = false

function toggleCross(e: Event) {
  // exposed map 是 Ref——toValue 解包取实例
  const m = toValue(mc.value?.map)
  if (!m) return
  crossOn = (e.target as HTMLInputElement).checked
  m.options.centerCross = crossOn
}

function setOpacity(e: Event) {
  // exposed layer 是 Ref——toValue 解包；options 是 maptalks Proxy——直接赋值即触发 config
  const bl = toValue(blRef.value?.layer)
  if (!bl) return
  const v = Number((e.target as HTMLInputElement).value)
  opacity.value = v
  bl.options.opacity = v
}

function toggleVisible(e: Event) {
  const l = toValue(vlRef.value?.layer)
  if (!l) return
  l.options.visible = (e.target as HTMLInputElement).checked
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（Proxy options 直接赋值生效）' : '加载中…'))
</script>
