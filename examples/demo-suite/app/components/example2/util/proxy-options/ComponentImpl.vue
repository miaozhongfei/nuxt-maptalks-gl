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
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const blRef = ref<{ layer: ShallowRef<MaptalksTileLayer | null>; show: () => void; hide: () => void } | null>(null)
const vlRef = ref<{ layer: ShallowRef<MaptalksVectorLayer | null>; show: () => void; hide: () => void } | null>(null)

const opacity = ref(1)
let crossOn = false

function toggleCross(e: Event) {
  const m = mc.value?.map
  if (!m) return
  crossOn = (e.target as HTMLInputElement).checked
  ;(m.options as any).centerCross = crossOn
}

function setOpacity(e: Event) {
  const bl = toValue(blRef.value?.layer)
  if (!bl) return
  const v = Number((e.target as HTMLInputElement).value)
  opacity.value = v
  ;(bl.options as any).opacity = v
}

function toggleVisible(e: Event) {
  const l = toValue(vlRef.value?.layer)
  if (!l) return
  ;(l.options as any).visible = (e.target as HTMLInputElement).checked
}
</script>
