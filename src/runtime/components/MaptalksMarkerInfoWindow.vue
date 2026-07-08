<template>
  <div style="display: none">
    <div ref="wrapper"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, ref, toValue, useSlots, watch } from 'vue'

import { useMaptalksMarkerInfoWindow } from '../composables/useMaptalksMarkerInfoWindow'
import { MARKER_GEOMETRY_KEY } from '../core/map-context'

const props = withDefaults(
  defineProps<{
    title?: string
    width?: number
    height?: number
    custom?: boolean
    autoPan?: boolean
    single?: boolean
    animation?: string
    autoOpenOn?: string | null
    autoDispose?: boolean
  }>(),
  { autoDispose: true },
)

const emit = defineEmits<{
  open: []
  close: []
}>()

const slots = useSlots()
const wrapper = ref<HTMLElement | null>(null)

const geometry = inject(MARKER_GEOMETRY_KEY)
if (!geometry) throw new Error('[nuxt-maptalks-gl] MaptalksMarkerInfoWindow 必须在 MaptalksMarker 内使用')

const { open, close } = useMaptalksMarkerInfoWindow(geometry, {
  title: props.title,
  width: props.width,
  height: props.height,
  custom: props.custom,
  autoPan: props.autoPan,
  single: props.single,
  animation: props.animation,
  autoDispose: props.autoDispose,
  autoOpenOn: props.autoOpenOn,
  events: {
    open: () => emit('open'),
    close: () => emit('close'),
  },
})

// geometry + wrapper 都就绪后，通过 getInfoWindow 只设 content，不动其他配置（animation 等保持 maptalks 默认）
watch(
  [() => toValue(geometry), wrapper],
  async ([g, w]) => {
    if (g && w) {
      await nextTick()
      const m = g as { getInfoWindow?(): { setContent?(c: string): void } | null }
      const iw = m.getInfoWindow?.()
      console.log('MaptalksMarkerInfoWindow watch geometry+wrapper',iw)
      console.log('MaptalksMarkerInfoWindow watch geometry+wrapper',JSON.stringify(iw))
      iw?.setContent?.(w.innerHTML)
    }
  },
  { immediate: true },
)

defineExpose({ open, close })
</script>
