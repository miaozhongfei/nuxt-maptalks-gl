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

// geometry + wrapper 都就绪后，用 iw.options 合并已有配置，只覆盖 content
watch(
  [() => toValue(geometry), wrapper],
  async ([g, w]) => {
    if (g && w) {
      await nextTick()
      const m = g as { getInfoWindow?(): { options?: Record<string, unknown> } | null; setInfoWindow?(opts: Record<string, unknown>): void }
      const iw = m.getInfoWindow?.()
      m?.setInfoWindow?.({ ...iw?.options, content: w.innerHTML })
    }
  },
  { immediate: true },
)

defineExpose({ open, close })
</script>
