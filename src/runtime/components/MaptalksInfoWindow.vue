<template>
  <div><slot /></div>
</template>

<script setup lang="ts">
import { inject, watch } from 'vue'
import { useMaptalksInfoWindow } from '../composables/useMaptalksInfoWindow'
import { MAP_KEY } from '../core/map-context'

const props = withDefaults(
  defineProps<{ coordinates?: unknown; geometry?: unknown; visible?: boolean }>(),
  { visible: true },
)

const map = inject(MAP_KEY)
if (!map) throw new Error('[nuxt-maptalks-gl] MaptalksInfoWindow 必须在 MaptalksMap 内使用')

const coord = () => props.coordinates ?? props.geometry

const { show, hide } = useMaptalksInfoWindow(map, {
  content: '<div style="padding:8px 12px">无 options</div>',
})

let visibleJustBecameTrue = false

watch(() => props.visible, (v) => {
  if (v) {
    visibleJustBecameTrue = true
    if (coord() !== undefined) show(coord())
  } else {
    hide()
  }
}, { immediate: true })

watch(() => props.coordinates ?? props.geometry, (c) => {
  if (visibleJustBecameTrue) { visibleJustBecameTrue = false; return; }
  if (props.visible && c !== undefined) show(c)
})

defineExpose({ show, hide })
</script>
