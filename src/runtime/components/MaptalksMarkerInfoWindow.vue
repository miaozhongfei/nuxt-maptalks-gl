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
    animation?: boolean
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

// geometry 和 wrapper 都就绪后一次性设完整 options+content（不丢其他参数）
watch(
  [() => toValue(geometry), wrapper],
  async ([g, w]) => {
    if (g && w) {
      await nextTick()
      const m = g as { setInfoWindow?(opts: Record<string, unknown>): void }
      const opts: Record<string, unknown> = { content: w.innerHTML };
      if (props.title !== undefined) opts.title = props.title;
      if (props.width !== undefined) opts.width = props.width;
      if (props.height !== undefined) opts.height = props.height;
      if (props.custom !== undefined) opts.custom = props.custom;
      if (props.autoPan !== undefined) opts.autoPan = props.autoPan;
      if (props.single !== undefined) opts.single = props.single;
      if (props.animation !== undefined) opts.animation = props.animation;
      if (props.autoOpenOn !== undefined) opts.autoOpenOn = props.autoOpenOn;
      m?.setInfoWindow?.(opts);
    }
  },
  { immediate: true },
)

defineExpose({ open, close })
</script>
